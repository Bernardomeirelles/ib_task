# IB Task Manager - Architecture & Component Flow

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Browser LocalStorage                         │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │ ib_tasks (all data)  │      │ ib_active_task (ID)  │        │
│  └──────────────────────┘      └──────────────────────┘        │
│           △                               △                     │
│           │ Sync on change               │ Updates             │
└──────────────────────────────────────────────────────────────────┘
           │                               │
           └───────────────┬───────────────┘
                           │
                    ┌──────▼──────────┐
                    │  KanbanBoard    │
                    │ (Main Component)│
                    └───────┬────┬────┘
                            │    │
              ┌─────────────┼────┼─────────────┐
              │             │    │             │
         ┌────▼──┐  ┌───────▼─┐ ┌─▼─────┐ ┌──▼─────┐
         │TopBar │  │Kanban   │ │Create │ │Keyboard│
         │Component│   Cols  │ │Modal  │ │Shortcuts│
         └────────┘  └───────┬─ └───────┘ └─────────┘
                            │
              ┌─────────────┴──────────────┐
              │                            │
         ┌────▼────────┐          ┌───────▼───┐
         │KanbanColumn │          │ TaskCard  │
         │(4 columns)  │          │(Draggable)│
         └─────────────┘          └───────────┘
                                        │
                        ┌───────────────┼───────────────┐
                        │               │               │
                   ┌────▼────┐  ┌──────▼──┐  ┌───────▼─┐
                   │ Timer   │  │ Notes   │  │ Delete  │
                   │ Display │  │ Section │  │ Button  │
                   └─────────┘  └─────────┘  └─────────┘
```

---

## Component Hierarchy

```
App
├── app/layout.tsx (Root Layout)
│   └── app/globals.css (Dark mode styling)
│
└── app/page.tsx (Client Component)
    │
    └── KanbanBoard (Main Logic)
        ├── TopBar
        │   └── Shows: Active task, Total time, Task count
        │
        ├── DragDropContext
        │   └── KanbanColumn (x4)
        │       ├── Column: "Incoming"
        │       ├── Column: "In Progress"
        │       ├── Column: "Waiting / Comments"
        │       └── Column: "Completed"
        │           │
        │           └── TaskCard (x many)
        │               ├── Timer Display
        │               ├── Play/Pause Button
        │               ├── Delete Button
        │               └── Notes Section
        │
        ├── CreateTaskModal
        │   ├── Input: Codename
        │   ├── Input: Staffing Time
        │   └── Buttons: Create / Cancel
        │
        └── Floating Action Button (+)
            └── Opens CreateTaskModal
```

---

## Hook Usage Map

```
useLocalStorage('ib_tasks')
│
├─ Returns: [tasks, setTasks]
├─ Persists to: localStorage['ib_tasks']
└─ Used in: KanbanBoard.tsx (main state)

useLocalStorage('ib_active_task')
│
├─ Returns: [activeTaskId, setActiveTaskId]
├─ Persists to: localStorage['ib_active_task']
└─ Used in: KanbanBoard.tsx, TopBar.tsx

useTimer(isActive)
│
├─ Returns: elapsedTime (in seconds)
├─ Triggers: Every 1 second if isActive=true
├─ Used in: TaskCard.tsx (per-card timer)
└─ Note: Each TaskCard manages own visual timer

useKeyboardShortcuts(callbacks)
│
├─ Listens to: Window keydown events
├─ Handlers:
│  │ 'N' → onCreate
│  │ 'Space' → onToggleTimer
│  │ '1','2','3','4' → onMoveColumn
│  └─ (Ignores if in input field)
│
└─ Used in: KanbanBoard.tsx (global shortcuts)
```

---

## State Management Flow

### 1. Initial Load
```
User opens app
    ↓
KanbanBoard mounts
    ↓
useLocalStorage hooks read from storage
    ↓
Set initial state from localStorage
    ↓
Render with existing tasks
```

### 2. Create New Task
```
User presses N
    ↓
CreateTaskModal opens
    ↓
User enters codename + time
    ↓
Click "Create"
    ↓
handleCreateTask()
    ↓
Add to tasks array
    ↓
setTasks() triggers update
    ↓
useLocalStorage saves to storage
    ↓
Component re-renders
```

### 3. Start Timer
```
User clicks Play button
    ↓
handleToggleTimer(taskId)
    └─ Pause any previous task
    ↓
Set isActive=true
Set startTime=Date.now()
    ↓
updateTaskInStorage(updatedTask)
    ↓
setActiveTaskId(taskId)
    ↓
Interval timer increments every 1s
    ↓
TaskCard UI updates in real-time
```

### 4. Move Task to Column
```
User drags card OR presses 1/2/3/4
    ↓
handleDragEnd() or handleMoveColumn()
    ↓
Check if moving to "Completed"
    ├─ YES: Stop timer if active
    └─ NO: Just move
    ↓
Update columnId in task object
    ↓
updateTaskInStorage()
    ↓
useLocalStorage saves immediately
    ↓
Re-render components
```

### 5. Page Reload
```
Page refreshes or app reopens
    ↓
KanbanBoard mounts
    ↓
useLocalStorage reads from browser storage
    ↓
Get 'ib_tasks' and 'ib_active_task'
    ↓
Each task recalculates elapsed time:
    totalTime + (Date.now() - startTime)/1000
    ↓
Timers resume if was active
    ↓
UI shows correct state
```

---

## Data Structure

### Task Object
```typescript
interface Task {
  id: string;                    // Unique: Date.now().toString()
  codename: string;              // "Project Falcon"
  staffingTime: string;          // "2h", "30m"
  columnId: 'incoming' | 'in-progress' | 'waiting' | 'completed';
  notes: string;                 // User-added notes (optional)
  createdAt: number;             // Timestamp when created
  startTime: number | null;      // When timer last started
  elapsedTime: number;           // (Deprecated - for reference)
  isActive: boolean;             // Currently running timer?
  totalTime: number;             // Sum of all work sessions (seconds)
}
```

### Column Object
```typescript
interface Column {
  id: 'incoming' | 'in-progress' | 'waiting' | 'completed';
  title: string;
}

// Example:
{
  id: 'in-progress',
  title: 'In Progress'
}
```

---

## Event Flow for Keyboard Shortcuts

```
Window keydown event fired
    ↓
useKeyboardShortcuts listener catches it
    ↓
Check if target is input (ignore if so)
    ↓
Parse key:
    ├─ N → onNewTask()
    │      └─ setShowModal(true)
    │
    ├─ Space → onToggleTimer()
    │          └─ handleToggleTimer(activeTaskId)
    │
    └─ 1/2/3/4 → onMoveColumn(index)
                 └─ handleMoveColumn(columnIndex)
    ↓
Trigger corresponding handler
    ↓
Update state
    ↓
useLocalStorage persists
    ↓
UI re-renders
```

---

## Timer Calculation Logic

### Real-Time Display
```javascript
// When user views a task:
const elapsedSeconds = 
  taskTimers[task.id] || 0;

// This updates every 1 second if task.isActive
// Includes: totalTime + current session time
```

### Persistence Across Reload
```javascript
// On app load:
tasks.forEach((task) => {
  if (task.isActive && task.startTime) {
    // Calculate how long it's been offline
    const offlineTime = 
      (Date.now() - task.startTime) / 1000;
    
    // Total = already recorded + offline time
    timers[task.id] = 
      task.totalTime + offlineTime;
  }
});
```

---

## Rendering Optimization

### What Triggers Re-Render?
1. **State Change** (via setTasks, setActiveTaskId)
2. **Timer Update** (every 1 second for active task)
3. **Drag End** (re-render moved card)
4. **Modal Open/Close**

### Performance Strategies
- ✅ Memoization: TaskCard is memoized for drag/drop
- ✅ Isolated Timers: Each TaskCard has own timer state
- ✅ Batch Updates: Multiple changes in one setTasks call
- ✅ No Unnecessary Renders: Conditional rendering for modal/notes
- ✅ CSS-Based Colors: Not JS calculations

---

## File Dependencies

```
app/layout.tsx
    ↓
app/globals.css (imports Tailwind)

app/page.tsx
    ↓ imports
    └── KanbanBoard.tsx
        ├── imports TopBar.tsx
        ├── imports KanbanColumn.tsx
        │   └── imports TaskCard.tsx
        ├── imports CreateTaskModal.tsx
        ├── imports DragDropContext (react-beautiful-dnd)
        ├── uses hooks/useLocalStorage.ts
        ├── uses hooks/useKeyboardShortcuts.ts
        ├── uses types/index.ts
        └── uses utils/timeUtils.ts
```

---

## CSS Architecture

### Global Styles (app/globals.css)
- ✅ TailwindCSS directives
- ✅ Dark mode base colors
- ✅ Scrollbar styling
- ✅ Focus visible states
- ✅ Font smoothing
- ✅ Body/html overflow:hidden (prevents scroll)

### Component Styles (TailwindCSS classes)
- Each file uses inline TailwindCSS classes
- No additional CSS files needed
- Theme colors defined in tailwind.config.ts
- Responsive via Tailwind breakpoints (though desktop-only)

### Tailwind Config
```typescript
// Dark theme colors:
'dark-bg': '#0a0e27'        // Main background
'dark-surface': '#1a1f3a'   // Card/container background
'dark-border': '#2a2f4a'    // Border color

// Status colors:
'green-status': '#10b981'   // 0-30 min
'yellow-status': '#f59e0b'  // 30-90 min
'orange-status': '#f97316'  // 90-180 min
'red-status': '#ef4444'     // 180+ min
```

---

## TypeScript Types

### Main Types Used
```typescript
Task interface          - Task data structure
Column interface        - Column configuration
React.FC               - Functional Component type
React.ReactNode        - Component children
Record<string, number> - TaskTimers mapping
Omit<Task, ...>        - Partial task for creation
```

### Type Safety Benefits
- ✅ Catch errors at compile-time
- ✅ IDE autocomplete suggestions
- ✅ Refactoring safety
- ✅ Documentation via types

---

## Deployment Readiness

### Build Process
```
npm run build
    ↓
Next.js compiles all .tsx files
    ↓
TailwindCSS trees unused styles
    ↓
JavaScript minified
    ↓
Output in .next/ folder
```

### Ready For
- ✅ Vercel deployment
- ✅ Docker containerization
- ✅ Static hosting (with export)
- ✅ Self-hosted servers
- ✅ CI/CD pipelines

---

**Architecture Version**: 1.0  
**Last Updated**: February 26, 2026  
**Status**: Stable
