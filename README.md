# IB Staffing Board - Investment Banking Workflow Manager

A **dark mode, high-performance Kanban board** designed specifically for Investment Banking analysts to manage live staffings and deliverables with real-time timers.

Minimalistic, Bloomberg Terminal-inspired UI optimized for full-screen workspace during the entire workday.

## 🎯 Features

### Kanban Board
- **4 Columns**: Incoming → In Progress → Waiting/Comments → Completed
- **Drag & Drop**: Move staffings between columns effortlessly
- **Persistent State**: Everything saved to LocalStorage (100% offline)

### Real-Time Staffing Timer
- ⏱️ **Live Timer**: HH:MM:SS format with sub-second precision
- **Single Active Timer**: Only one staffing can run at a time
- **Auto-Pause**: Starting a new timer automatically pauses the previous one
- **Persistent**: Timer continues running even after page reload
- **Timer Controls**: Start, Pause, Reset buttons per card

### Visual Urgency System
Cards automatically change color based on elapsed time:
- 🟢 **0-30 min**: Green (fresh assignment)
- 🟡 **30-90 min**: Yellow (building up)
- 🟠 **90-180 min**: Orange (heating up)
- 🔴 **180+ min**: Red + Pulsing (critical / VP about to call)

### Staffing Card Details
Each card contains:
- **Task Codename**: Short project name (Project Falcon, Deck Update, etc.)
- **Staffing Time**: HH:MM when the analyst was assigned
- **Elapsed Time**: Live running timer
- **Quick Notes**: Add comments to each staffing
- **Status**: Automatically marked completed when moved to final column

### User Experience
- ✨ Clean, minimalist dark UI (Bloomberg Terminal aesthetic)
- ⚡ Ultra-fast performance (no backend, pure frontend)
- 🖥️ Fullscreen optimized layout
- 📱 Responsive design (desktop-focused)
- ♿ Keyboard accessible

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
```

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript
- **Build**: Vite (lightning-fast bundler)
- **Styling**: Tailwind CSS
- **State**: React hooks + LocalStorage
- **No dependencies**: No databases, APIs, or servers

### Project Structure
```
src/
├── components/              # React components
│   ├── KanbanCard.tsx          # Individual staffing card with timer
│   ├── KanbanColumn.tsx        # Kanban column container
│   └── NewCardForm.tsx         # Modal form to create staffings
├── services/                # Business logic
│   └── kanbanService.ts        # Kanban operations & timer logic
├── types/                   # TypeScript interfaces
│   └── index.ts                # StaffingCard, ColumnType, etc.
├── App.tsx                  # Main application component
├── main.tsx                 # React entry point
└── index.css                # Global styles (dark mode)
```

### Component Flow
```
App
├── KanbanColumn × 4 (Incoming, In Progress, Waiting, Completed)
│   └── KanbanCard × N (each staffing)
│       ├── Timer Display (HH:MM:SS + urgency color)
│       ├── Timer Controls (Start, Pause, Reset)
│       └── Notes Section
└── NewCardForm (modal)
```

## 💻 Usage

### Creating a Staffing
1. Click **"+ NEW STAFFING"** button
2. Enter **Task Codename** (e.g., "Project Falcon")
3. Enter **Staffing Time** (e.g., "09:30")
4. Click **"Create Staffing"**

### Managing Timers
- **▶ START**: Begin timer on a staffing
- **⏸ PAUSE**: Pause current timer
- **🔄 RESET**: Reset timer to 00:00:00

### Moving Staffings
- **Drag & Drop**: Click and drag card between columns
- **Auto-Complete**: Moving to "Completed" column stops the timer

### Adding Notes
- 📝 Click **"Add Notes"** or **"Edit Notes"** on a card
- Type quick comments or context
- Click **"Save"** to persist

### Deleting Staffings
- Click **✕** button on a card to remove it

## 💾 Data Persistence

All data is stored in **browser LocalStorage**:
- Staffing cards and their states
- Timer information (elapsed time, active state)
- Column positions
- Notes and metadata

**No internet connection required** - Everything works 100% offline.

## 🎨 Design Philosophy

- **Dark Mode**: Reduces eye strain during long workdays
- **Terminal Aesthetic**: Bloomberg Terminal-inspired UI
- **Minimalist**: Only essential information visible
- **High Contrast**: Easy to read urgency colors
- **Fullscreen Optimized**: Designed to stay open all day
- **Fast**: No database, no round-trips, instant feedback

## 📊 Status Bar

Real-time indicators in the header:
- **Active**: Number of staffings with running timers
- **Total**: Total staffings created
- **Done**: Number of completed staffings

## ⌨️ Keyboard Shortcuts (Future)

```
N - Create new staffing
ESC - Close modal
SPACE - Start/Pause timer
DEL - Delete card
```

##🔮 Future Enhancements

- [ ] Keyboard shortcuts
- [ ] Export daily summary report
- [ ] Time budget per resource
- [ ] Multi-day persistence/archive
- [ ] Sound alerts on critical threshold
- [ ] Integration with calendar APIs
- [ ] Team dashboard view
- [ ] Staffing time estimation

## 📝 Notes

- **Single Timer**: Each analyst manages their own staffings
- **Reload Safe**: Close/reload browser without losing data
- **No Cloud**: Runs entirely in your browser
- **Privacy**: Zero data leaves your machine

## 🛠️ Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Project Commands
```bash
npm install     # Install dependencies
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
```

## 📄 License

MIT

---

**Built for Investment Banking Analysts** 🏛️  
*Stay focused. Stay productive. Manage your staffing efficiently.*

