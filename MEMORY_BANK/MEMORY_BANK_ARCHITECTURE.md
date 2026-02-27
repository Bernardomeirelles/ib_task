# Memory Bank - Architecture & Data Flow

## State Management Flow

```
App Start
    ↓
useLocalStorage Hooks Load Data
    ↓
[tasks, setTasks] ← ib_tasks
[activeTask, setActiveTask] ← ib_active_task
[language, setLanguage] ← ib_language
    ↓
KanbanBoard Component Renders
    ↓
┌─────────────────────────────────────┐
│ KanbanColumn[] x 5                  │
│ ├─ Incoming                         │
│ ├─ In Progress                      │
│ ├─ Waiting                          │
│ ├─ Adjusting Comments               │
│ └─ Completed                        │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ TaskCard[] (filtered by columnId)   │
│ Each card shows:                    │
│ ├─ Codename                         │
│ ├─ Timer Display (D/W/F split)     │
│ ├─ Color Border (time-based)       │
│ └─ Action Buttons                   │
└─────────────────────────────────────┘
```

## Timer System Logic

### Single Active Timer Architecture
```
Only ONE task timer can be active at a time

State: activeTask = Task ID of running timer (or null)

When User Clicks Play on Task A:
  1. If different task (B) was active:
     - Stop B's timer
     - Save B's elapsed time
     - Persist B to localStorage
  2. Start A's timer
  3. Set activeTask = A.id
  4. Update UI real-time every 100ms

When User Clicks Play on Same Task A:
  - Resume A's timer (continue from where it stopped)

When User Creates New Task:
  - Auto-pause any active timer
  - No new timer starts
```

### Timer Type Breakdown
For each task, track three separate time counters:
- **Doing:** Main work time on task
- **Waiting:** Blocked waiting for response/info
- **Fixing:** Fixing feedback/issues

Only ONE can accumulate at a time based on column:
```typescript
// In TaskCard, user can toggle between D/W/F
// Only selected type accumulates elapsed time
const timerType = task.currentTimerType; // 'doing' | 'waiting' | 'fixing'

if (isTimerRunning) {
  if (timerType === 'doing') task.doingTime += elapsed;
  else if (timerType === 'waiting') task.waitingTime += elapsed;
  else if (timerType === 'fixing') task.fixingTime += elapsed;
}
```

## Component Dependency Tree

```
App (layout.tsx)
└── page.tsx (use client)
    └── KanbanBoard (main state hub)
        ├── TopBar
        │   ├── Status Display (active task, total time)
        │   └── LanguageSwitcher (PT/EN toggle)
        │
        ├── CreateTaskModal
        │   └── Form (codename, staffingTime inputs)
        │
        ├── DragDropContext (react-beautiful-dnd)
        │   └── KanbanColumn[] x5
        │       └── Droppable
        │           └── TaskCard[] (filtered by column)
        │               ├── Timer Display
        │               ├── Timer Controls (Play/Pause/D/W/F buttons)
        │               ├── Delete Button
        │               ├── Notes Editor
        │               └── Send to Analytics Button
        │
        └── AnalyticsView
            ├── Bar Chart (Project duration)
            └── Pie Chart (D/W/F breakdown, clickable)
```

## Data Mutation Patterns

### Adding New Task
```
User Input → CreateTaskModal
  → onClick("Add Task")
    → validateInputs()
    → newTask = { id: uuid(), codename, columnId: 'incoming', ... }
    → setTasks([...tasks, newTask])
    → localStorage.setItem('ib_tasks', JSON.stringify(...))
    → Modal closes
```

### Toggling Timer
```
User Action → TaskCard.onClick(playButton)
  → if (activeTask && activeTask.id !== task.id)
      → Save previous task's time
    → setActiveTask(task.id)
    → Timer starts ticking
    → Every 100ms: update displayTime (UI only)
    → Every 5s: persist to localStorage
```

### Moving Task (Drag & Drop)
```
react-beautiful-dnd → onDragEnd()
  → Get source/destination
  → Update task.columnId
  → setTasks([...updated tasks])
  → localStorage.setItem('ib_tasks', JSON.stringify(...))
```

### Sending to Analytics
```
User clicks "Send to Analytics" on Completed task
  → addToAnalytics(task)
  → Create project object: { name: task.codename, doingTime, waitingTime, fixingTime }
  → Push to analytics array
  → localStorage.setItem('ib_analytics', JSON.stringify(...))
  → Task becomes read-only (not editable)
  → Remove delete button from UI
```

## localStorage Keys and Structure

### `ib_tasks` - Array of Task Objects
```json
[
  {
    "id": "uuid-1234",
    "codename": "FEATURE-001",
    "columnId": "in-progress",
    "staffingTime": 3600,
    "totalTime": 1850,
    "doingTime": 1200,
    "waitingTime": 500,
    "fixingTime": 150,
    "notes": "Started implementation",
    "createdAt": "2026-02-27T10:00:00Z",
    "completedAt": null
  }
]
```

### `ib_active_task` - String (Task ID)
```
"uuid-1234"  // Currently running timer
or
null         // No timer active
```

### `ib_analytics` - Array of Archived Projects
```json
[
  {
    "id": "uuid-5678",
    "name": "PROJECT-001",
    "doingTime": 7200,
    "waitingTime": 1800,
    "fixingTime": 600,
    "totalTime": 9600,
    "archivedAt": "2026-02-27T15:30:00Z"
  }
]
```

### `ib_language` - String
```
"pt"  // Portuguese
or
"en"  // English
```

## Keyboard Shortcuts Implementation

```typescript
// useKeyboardShortcuts.ts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Don't trigger if focused on input
    if (document.activeElement?.tagName === 'INPUT') return;
    if (document.activeElement?.tagName === 'TEXTAREA') return;

    switch(e.key.toLowerCase()) {
      case 'n':
        openCreateModal();
        break;
      case ' ':
        e.preventDefault();
        toggleActiveTaskTimer();
        break;
      case '1': moveTaskToColumn('incoming'); break;
      case '2': moveTaskToColumn('in-progress'); break;
      case '3': moveTaskToColumn('waiting'); break;
      case '4': moveTaskToColumn('adjusting'); break;
      case '5': moveTaskToColumn('completed'); break;
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

## Color Border Logic

```typescript
// timeUtils.ts
export const getTaskColorBorder = (totalTimeSeconds: number): string => {
  const minutes = totalTimeSeconds / 60;
  
  if (minutes < 30) return 'border-green-500';     // 0-30m
  if (minutes < 90) return 'border-yellow-500';    // 30-90m
  if (minutes < 180) return 'border-orange-500';   // 90-180m
  return 'border-red-500';                         // 180m+
};
```

## Time Formatting Utility

```typescript
// timeUtils.ts
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};
```

## Translation System

```typescript
// translations.ts
const translations: Record<Language, Record<string, string>> = {
  pt: {
    'new-task': 'Nova Tarefa',
    'codename': 'Nome da Tarefa',
    'staffing-time': 'Tempo Estimado',
    'doing': 'Fazendo',
    'waiting': 'Esperando',
    'fixing': 'Ajustando',
    // ... more translations
  },
  en: {
    'new-task': 'New Task',
    'codename': 'Task Name',
    'staffing-time': 'Estimated Time',
    'doing': 'Doing',
    'waiting': 'Waiting',
    'fixing': 'Fixing',
    // ... more translations
  }
};

export const useTranslation = () => {
  const { language } = useLanguage();
  return {
    t: (key: string) => translations[language][key] || key
  };
};
```

## Critical Decision Points

### Why Single Active Timer?
- Prevents confusion: only one task being worked on
- Realistic workflow: developer works on one task at a time
- Automatic pause: when switching tasks, previous stops
- Easy tracking: clear which task is current

### Why localStorage Only?
- Offline-first: works without internet
- Simple deployment: no backend needed
- User privacy: data stays on device
- Quick startup: no API calls on load

### Why Simplified useLanguage Hook?
- Avoided Context API hydration issues
- Direct localStorage access is simpler
- Fewer wrapper components
- Faster initialization

## Performance Considerations

### Optimization Points
1. **Timer Update Frequency:** Updates UI every 100ms, persists every 5s (not every tick)
2. **Drag & Drop:** react-beautiful-dnd is optimized for large lists
3. **Component Re-renders:** Only affected components update (not whole board)
4. **localStorage Calls:** Batched - only persist when task changes, not live timer display

### Potential Bottlenecks (if many tasks)
- Too many tasks in one column → virtualize (windowing)
- localStorage size limit → implement data archival
- Re-render performance → use React.memo on TaskCard if needed
