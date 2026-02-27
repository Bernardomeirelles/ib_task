# IB Task Manager - Installation & Setup Guide

## Quick Start (5 minutes)

### 1. Prerequisites
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Modern browser** (Chrome, Firefox, Safari, Edge)

### 2. Installation Steps

```bash
# Navigate to the project directory
cd c:\Users\Bernardo\Downloads\ib

# Install all dependencies
npm install

# Start development server
npm run dev
```

### 3. Access the App
- **URL**: http://localhost:3000
- **Best practice**: Open in a new browser window and maximize/full-screen (F11)

---

## Project Structure

```
ib/
│
├── 📁 app/                          # Next.js App Router (main entry point)
│   ├── layout.tsx                   # Root layout (metadata, CSS)
│   ├── page.tsx                     # Home page (loads KanbanBoard)
│   └── globals.css                  # Global styles & dark mode
│
├── 📁 components/                   # React Components
│   ├── KanbanBoard.tsx              # Main logic & state management
│   ├── KanbanColumn.tsx             # Individual Kanban column
│   ├── TaskCard.tsx                 # Task card with timer & controls
│   ├── TopBar.tsx                   # Status bar (active task, time, count)
│   └── CreateTaskModal.tsx          # Modal for new tasks
│
├── 📁 hooks/                        # Custom React Hooks
│   ├── useLocalStorage.ts           # LocalStorage persistence
│   ├── useTimer.ts                  # Timer interval logic
│   └── useKeyboardShortcuts.ts      # Keyboard event handlers
│
├── 📁 types/                        # TypeScript Interfaces
│   └── index.ts                     # Task & Column types
│
├── 📁 utils/                        # Utility Functions
│   └── timeUtils.ts                 # Time formatting & color logic
│
├── 📁 .next/                        # Next.js build output (auto-generated)
├── 📁 node_modules/                 # Dependencies (auto-generated)
│
├── 📋 Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json                # TypeScript config
│   ├── next.config.js               # Next.js config
│   ├── tailwind.config.ts           # TailwindCSS config
│   ├── postcss.config.js            # PostCSS config
│   └── .eslintrc.json               # ESLint config
│
├── 📄 Documentation
│   ├── README.md                    # Main documentation
│   ├── SETUP.md                     # This file
│   └── .gitignore                   # Git ignore patterns
```

---

## Available Commands

### Development
```bash
# Start dev server (with hot reload)
npm run dev

# Access at: http://localhost:3000
```

### Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Code Quality
```bash
# Run ESLint
npm run lint
```

---

## Environment & Dependencies

### Key Technologies
| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 15.x | React framework |
| React | 18.x | UI library |
| TailwindCSS | 3.x | Styling |
| react-beautiful-dnd | 13.x | Drag & drop |
| lucide-react | 0.408+ | Icons |
| TypeScript | 5.x | Type safety |

### Install Sizes
- node_modules: ~500 MB
- bundle size (production): ~140 KB JS

---

## Data Persistence

### How it Works
- **Storage**: Browser's LocalStorage (client-side only)
- **Keys**:
  - `ib_tasks` - All tasks and their data
  - `ib_active_task` - Currently active task ID
- **Persistence**: Automatic on every change
- **Survival**: 
  - ✅ Browser restart
  - ✅ Page reload
  - ✅ Offline mode
  - ❌ Browser cache clear
  - ❌ Private/Incognito mode (session-only)

### View/Manage LocalStorage
```javascript
// In browser console (F12)

// View all data
console.log(JSON.parse(localStorage.getItem('ib_tasks')));
console.log(localStorage.getItem('ib_active_task'));

// Clear all data
localStorage.clear();

// Clear specific key
localStorage.removeItem('ib_tasks');
localStorage.removeItem('ib_active_task');
```

---

## Keyboard Shortcuts Reference

| Key | Action | Details |
|-----|--------|---------|
| **N** | Create new task | Opens modal |
| **Space** | Toggle active timer | Start/pause current task |
| **1** | Move to "Incoming" | Active task only |
| **2** | Move to "In Progress" | Active task only |
| **3** | Move to "Waiting/Comments" | Active task only |
| **4** | Move to "Completed" | Auto-stops timer |

---

## Timer Logic Explained

### Timer Behavior
1. **Start**: Click ▶ button or use keyboard shortcut
2. **Pause**: Click ⏸ button or start another task
3. **Auto-Stop**: Automatically stops when moving to "Completed"
4. **Persistence**: Survives page reload and browser restart

### Color Progression
```
Time Elapsed → Card Color
0-30 min     → 🟢 Green (fresh)
30-90 min    → 🟡 Yellow (warming up)
90-180 min   → 🟠 Orange (getting long)
180+ min     → 🔴 Red (critical attention needed)
```

### Only One Active Timer
- Starting a new task automatically **pauses** the previous one
- Timer state saved to LocalStorage after each change
- Time continues accumulating in total even when paused

---

## Troubleshooting

### Dev Server Won't Start
```bash
# Problem: Port 3000 already in use
# Solution 1: Kill existing process
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Solution 2: Use different port
npm run dev -- -p 3001

# Then access at http://localhost:3001
```

### Dependencies Won't Install
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force

# Reinstall
npm install
```

### Data Not Persisting
```javascript
// Check if localStorage is available
console.log(typeof localStorage);  // Should be 'object'

// Check stored data
console.log(localStorage);

// If Private/Incognito: Data won't persist beyond session
```

### Build Errors
```bash
# Clear Next.js cache
Remove-Item -Path ".next" -Recurse -Force

# Rebuild
npm run build
```

### Timer Showing Incorrect Time
- **Expected**: Timer may jump if page was inactive
- **Reason**: Calculates elapsed time from start time
- **Fix**: Page reload to resync

---

## Performance Optimization

### Already Optimized For
- ✅ Minimal CSS (~50 KB)
- ✅ Efficient React re-renders (hooks)
- ✅ LocalStorage atomic updates
- ✅ No external API calls
- ✅ Smooth 60 FPS animations
- ✅ Dark mode to reduce eye strain

### Recommendations For All-Day Use
1. **Full-screen mode** (F11) to minimize distractions
2. **Mute browser notifications** to stay focused
3. **Close unnecessary tabs** to free RAM
4. **Regular task cleanup** - move completed tasks
5. **Daily app restart** - refresh memory cache

---

## Keyboard Shortcuts for Development

### Browser DevTools
| Shortcut | Action |
|----------|--------|
| F12 | Open Developer Tools |
| Ctrl+Shift+C | Inspect element |
| Ctrl+Shift+J | Open Console |
| Ctrl+Shift+K | Open Network tab |

### Editor Shortcuts
| Shortcut | Action |
|----------|--------|
| Ctrl+` | Open terminal in VS Code |
| Ctrl+F | Find in file |
| Ctrl+H | Find & replace |
| Ctrl+/ | Toggle comment |

---

## Production Deployment

### Build Once for Deployment
```bash
# Create production build
npm run build

# Test production build locally
npm start

# Then deploy the `.next` and `public` folders to your server
```

### Environment Variables (if needed)
Create `.env.local`:
```
NEXT_PUBLIC_APP_NAME=IB Task Manager
NEXT_PUBLIC_VERSION=1.0.0
```

---

## File Size Reference

```
Initial Install Size:
├── node_modules/          ~500 MB
├── package.json           ~2 KB
├── Source code            ~50 KB

Production Build:
├── .next/static/          ~140 KB
├── HTML                   ~36 KB
└── Total JS               ~139 KB
```

---

## Support & Issues

### Common Issues
1. **App loading slowly** → Check network in DevTools, clear cache
2. **Timer behaving oddly** → Page reload, then restart task
3. **Data disappeared** → Check if localStorage was cleared
4. **Styles not loading** → Clear browser cache, hard refresh (Ctrl+Shift+R)

### Debug Mode
Add to `app/page.tsx`:
```typescript
useEffect(() => {
  console.log('Current tasks:', tasks);
  console.log('Active task:', activeTaskId);
  console.log('Task timers:', taskTimers);
}, [tasks, activeTaskId, taskTimers]);
```

---

## Version History

**v1.0.0** (February 2026)
- ✅ Initial release
- ✅ 4-column Kanban board
- ✅ Real-time timers
- ✅ LocalStorage persistence
- ✅ Keyboard shortcuts
- ✅ Dark mode UI
- ✅ Drag & drop support
- ✅ Quick notes feature

---

## Next.js Specific Notes

### Development Mode Features
- Hot Module Reloading (HMR)
- Fast Refresh for React components
- Built-in TypeScript support
- Automatic route generation from `/app` folder

### Production Optimizations
- Automatic code splitting
- Image optimization
- Static page generation
- CSS minification
- JavaScript minification

### Debugging
```bash
# Verbose logging
DEBUG=* npm run dev

# Build analysis
npm run build -- --analyze
```

---

**Last Updated**: February 26, 2026  
**Status**: Production Ready  
**Support**: Contact Development Team
