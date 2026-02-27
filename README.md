# IB Task Manager

Minimal Kanban for Investment Banking workflows with real-time timers and offline persistence.

## Features
- 5 columns: Incoming, In Progress, Waiting/Comments, Adjusting Comments, Completed
- One active timer at a time with automatic pause
- Per-task time split: doing, waiting, fixing
- Analytics archive with project breakdown
- Drag and drop, keyboard shortcuts
- LocalStorage persistence (offline)

## Requirements
- Node.js 18+
- npm

## Install
```bash
cd c:\Users\Bernardo\Downloads\ib
npm install
```

## Run (dev)
```bash
npm run dev
```
Open http://localhost:3000

## Build (prod)
```bash
npm run build
npm start
```

## Keyboard Shortcuts
- N: New task
- Space: Start/pause active task
- 1/2/3/4/5: Move active task to columns (Incoming, In Progress, Waiting, Adjusting, Completed)

## Data Storage
- LocalStorage keys: ib_tasks, ib_active_task, ib_analytics

## Notes
- Completed tasks cannot be timed or dragged.
- Moving into Waiting or Adjusting switches to the matching timer type.
