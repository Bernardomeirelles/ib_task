# IB Task Manager

A minimalistic, ultra-fast desktop web application for Investment Banking analysts. Manages live banking tasks using a Kanban system with real-time timer tracking.

## Features

- **4-Column Kanban Board**: Incoming → In Progress → Waiting/Comments → Completed
- **Real-Time Timers**: Live tracking of time spent on each task
- **Smart Timer Management**: Only one active timer at a time; automatically pauses previous task
- **Visual Urgency System**: Color-coded cards based on elapsed time
  - 🟢 0–30 min (Green)
  - 🟡 30–90 min (Yellow)
  - 🟠 90–180 min (Orange)
  - 🔴 180+ min (Red - Critical)
- **Persistent Storage**: All data saved locally via browser localStorage (100% offline)
- **Drag & Drop**: Move tasks between columns with mouse or keyboard (1/2/3/4)
- **Quick Notes**: Add quick comments to tasks
- **Keyboard Shortcuts**:
  - `N` - Create new task
  - `Space` - Start/pause current active task
  - `1/2/3/4` - Move active task between columns
- **Top Status Bar**: Shows active task, total time spent today, and active task count
- **Dark Mode**: Apple-inspired, Helvetica-based minimalist design

## Tech Stack

- **Frontend**: Next.js (React 19)
- **Styling**: TailwindCSS
- **State**: Browser LocalStorage (offline first)
- **Drag & Drop**: react-beautiful-dnd
- **UI Icons**: lucide-react

## Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Setup

1. **Navigate to project directory**:
   ```bash
   cd /path/to/ib
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - The app automatically opens on `http://localhost:3000`
   - Full-screen recommended for best UX
   - Press `F11` for full-screen mode in your browser

## Project Structure

```
ib/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Main entry point
│   └── globals.css             # Global styles & dark mode
├── components/
│   ├── KanbanBoard.tsx         # Main board logic & state
│   ├── KanbanColumn.tsx        # Column with droppable area
│   ├── TaskCard.tsx            # Individual task card
│   ├── TopBar.tsx              # Status bar (top of app)
│   └── CreateTaskModal.tsx     # New task creation modal
├── hooks/
│   ├── useLocalStorage.ts      # localStorage persistence hook
│   ├── useTimer.ts             # Timer interval management
│   └── useKeyboardShortcuts.ts # Keyboard event handling
├── types/
│   └── index.ts                # TypeScript interfaces
├── utils/
│   └── timeUtils.ts            # Time formatting & color logic
├── package.json                # Dependencies & scripts
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
└── postcss.config.js           # PostCSS configuration
```

## Usage Guide

### Creating a Task

1. Press `N` or click the green `+` button (bottom-right)
2. Enter task codename (e.g., "Project Falcon", "Deck Update")
3. Enter staffing time estimate (e.g., "2h", "30m")
4. Click "Create"

### Managing Timers

1. **Start Timer**: Click play button on card or press `Space` (for active task)
2. **Pause Timer**: Click pause button or press `Space`
3. **Active Task**: Only one card can show active timer at a time
4. **Auto-Stop**: Timer automatically stops when moving task to "Completed"

### Moving Tasks

**Via Mouse**:
- Click and drag cards between columns

**Via Keyboard** (with active task selected):
- Press `1` → Move to "Incoming"
- Press `2` → Move to "In Progress"
- Press `3` → Move to "Waiting/Comments"
- Press `4` → Move to "Completed"

### Adding Notes

1. Click the comment icon on any card
2. Type notes in the text area
3. Click "Save" to persist

### Deleting Tasks

- Click the trash icon in the top-right corner of any card
- Task and its time data will be permanently removed

## Data Persistence

- **All data stored locally** in browser localStorage under key `ib_tasks`
- **Survives browser restart** and page reloads
- **No server required** - 100% offline capable
- **No data leaves your computer**

## Performance Notes

- Optimized for full-day use
- Minimal CSS bundle (~50KB)
- Efficient re-renders using React hooks
- LocalStorage updates on every change (atomic)
- Runs smoothly on MacBook Air and equivalent hardware

## Build & Production

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Export as Static Site

For deployment, use Next.js static export (requires `output: 'export'` in next.config.js)

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- No mobile optimization (desktop only)

## Keyboard Reference

| Key | Action |
|-----|--------|
| `N` | New task |
| `Space` | Start/pause active task |
| `1` | Move to "Incoming" |
| `2` | Move to "In Progress" |
| `3` | Move to "Waiting/Comments" |
| `4` | Move to "Completed" |

## Tips & Best Practices

1. **Use short codenames** - Easier to scan and remember
2. **Estimate staffing time** - Helps track expected vs actual
3. **Add notes early** - Useful for context later
4. **Complete tasks promptly** - Keeps board clean
5. **Full-screen mode** - Optimal for all-day use on laptops

## Troubleshooting

### Data not persisting?
- Check browser localStorage is enabled
- Clear cache if seeing old data
- Check browser DevTools → Application → LocalStorage

### Timer jumping around?
- This is expected if page was reloaded or inactive
- Timer resumes from last known state automatically

### Slow performance?
- Close unnecessary browser tabs
- Clear old completed tasks
- Restart the dev server

## License

Private - Investment Banking Use

## Support

For issues or feature requests, contact development team.

---

**Last Updated**: February 2026  
**Version**: 1.0.0
