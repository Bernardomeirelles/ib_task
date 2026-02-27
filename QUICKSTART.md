# IB Task Manager - Quick Reference

## 🚀 Start Here

### Installation (30 seconds)
```bash
cd c:\Users\Bernardo\Downloads\ib
npm install
npm run dev
# Open http://localhost:3000
```

### First Task (1 minute)
1. Press `N` or click `+` button
2. Enter codename: "Project Falcon"
3. Enter time: "2h"
4. Click "Create"
5. Click ▶️ to start timer
6. Watch the timer count!

---

## 🎮 Core Features

### 1. The Kanban Board
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  INCOMING   │ IN PROGRESS │WAITING/CMT  │ COMPLETED   │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Task A      │ Task B      │ Task C      │ Task D      │
│ (0m 45s)    │ (15m 23s)   │ (45m)       │ (2h 15m)    │
│ 🟢          │ 🟡          │ 🔴          │ ⏹️          │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 2. Create Tasks
- **Button**: Click green `+` in bottom-right
- **Shortcut**: Press `N`
- **Input**: Codename + Time estimate

### 3. Timer System
- **Start**: Click ▶️ or press `Space`
- **Pause**: Click ⏸️ or press `Space`
- **One Active**: Only one task can run at a time
- **Color Indicator**: Green → Yellow → Orange → Red

### 4. Move Tasks
**Method 1: Drag & Drop**
- Click and drag card to another column

**Method 2: Keyboard**
- Press `1` → Incoming
- Press `2` → In Progress
- Press `3` → Waiting
- Press `4` → Completed (auto-stops timer)

### 5. Add Notes
- Click 💬 icon on card
- Type notes
- Press "Save"

### 6. Delete Task
- Click 🗑️ icon
- Task and time deleted permanently

---

## ⏱️ Timer Colors

**What do the colors mean?**

```
🟢 GREEN (0-30 min)
   └─ Fresh task, just started

🟡 YELLOW (30-90 min)
   └─ Getting into it

🟠 ORANGE (90-180 min)
   └─ Long task, watch time

🔴 RED (180+ min / 3+ hours)
   └─ CRITICAL - VP about to ping!
```

---

## 📊 Top Status Bar

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Active: Project Falcon│ ⏱️ Today: 5h 23m │ Active: 7 │
│ Shortcuts: N | Space | 1/2/3/4                         │
└─────────────────────────────────────────────────────────┘
```

**Shows:**
- 🟡 Current active task name
- ⏱️ Total time worked today
- 📊 Number of incomplete tasks

---

## ⌨️ All Keyboard Shortcuts

| Key | What It Does |
|-----|--------------|
| N | New task |
| Space | Start/pause current task |
| 1 | Move active task to Incoming |
| 2 | Move active task to In Progress |
| 3 | Move active task to Waiting |
| 4 | Move active task to Completed |

**Tips:**
- Works only when NOT typing in a text field
- Great for power users
- Space = your most-used shortcut

---

## 💾 Data Persistence

**Your data is ALWAYS saved:**
- ✅ Closes browser completely → Data stays
- ✅ Computer restarts → Data stays
- ✅ Kill the dev server → Data stays
- ✅ Offline internet → Data stays

**Your data is NOT saved:**
- ❌ Clear browser cache
- ❌ Delete cookies
- ❌ Browser "Clear All" option
- ❌ Incognito/Private window (session-only)

**Storage Location**: Browser LocalStorage
- No internet needed
- No server involved
- 100% private
- Can hold thousands of tasks

---

## 🎨 Dark Mode Design

- **Color Scheme**: Apple-inspired dark theme
- **Font**: System font (Helvetica Neue, Arial)
- **Optimized For**: Laptop, full-screen, all-day use
- **Eye Strain**: Minimized with dark background
- **Contrast**: High, easy to read

---

## 📱 Workflow Example

### Morning (Start of Day)

1. Press `N` → Create "Roadshow Deck"
2. Est. time: "3h"
3. Press `Space` → Start timer ▶️
4. Work on it...

### Mid-Day (Task Switch)

1. Finished first task
2. Press `2` → Move to "Completed"
   - Timer auto-stops ✓
3. Press `N` → Create new task
4. Press `Space` → Start timer

### Status Check (Anytime)

1. Look at top bar
2. See: Active task, total time, remaining tasks
3. Quick visual scan of board by colors
4. Know what's critical (red cards)

### End of Day

1. All incomplete tasks still visible
2. Completed tasks greyed out
3. Total time worked today in top bar
4. Refresh tomorrow with data intact

---

## 🔧 Configuration

### Change Dev Port
```bash
npm run dev -- -p 3001
# Then http://localhost:3001
```

### Build for Production
```bash
npm run build
npm start
```

### Check Performance
Open DevTools (`F12`):
- Network tab → See bundle size
- Performance tab → Record and analyze
- Console → Check for errors

---

## 🐛 Troubleshooting Quick Tips

| Issue | Solution |
|-------|----------|
| Can't add task | Click green `+` or press `N` |
| Timer not running | Click ▶️ button on card |
| Data gone | Check browser cache wasn't cleared |
| App slow | Restart dev server, close tabs |
| Timer jumps | Refresh page to resync |
| Shortcuts not working | Click on app window first, don't focus input |

---

## 💡 Pro Tips

1. **Use SHORT codenames**
   - Good: "Falcon", "Deck", "Model"
   - Bad: "Update the financial model for Falcon project"

2. **Check red cards first**
   - If a card is red (3+ hours), it needs attention NOW

3. **Keyboard shortcuts > Mouse**
   - Faster workflow
   - Keeps hands on keyboard
   - Press `1` to organize quickly

4. **Daily cleanup**
   - Move old completed tasks off screen
   - Keeps board clean
   - Helps focus

5. **One timer at a time**
   - Don't try to multi-task
   - Starting new task pauses old one
   - Accurate time tracking

6. **Notes are your friend**
   - Add blockers, notes, next steps
   - Recover context after pause
   - Useful for handoff

7. **Full-screen mode**
   - Press F11 for distraction-free
   - Perfect for all-day work
   - Maximize board visibility

---

## 📚 Technology Stack

- **Frontend**: React 18 (latest stable)
- **Framework**: Next.js 15 (latest)
- **Styling**: TailwindCSS 3
- **State**: Browser LocalStorage
- **Drag & Drop**: react-beautiful-dnd
- **Icons**: lucide-react
- **Language**: TypeScript (type-safe)

---

## 🎯 Design Philosophy

**Minimalistic by design:**
- No clutter
- No animations (except useful ones)
- No external dependencies for data
- Fast loading
- Works offline
- 100% browser-based

**Optimized for bankers:**
- Real-time visibility
- Quick context switching
- Status at a glance
- Time tracking built-in
- Keyboard-first

---

## 📞 Getting Help

### Check These First
1. README.md - Full documentation
2. SETUP.md - Installation & troubleshooting
3. Browser DevTools (F12) - Errors & debugging
4. Keyboard shortcuts section (above) - Shortcuts reference

### Debug Tips
- Open DevTools: Press `F12`
- Console: Check for red error messages
- Network: Check if files loaded correctly
- LocalStorage: View stored data

---

## Version Info

**Current**: v1.0.0  
**Release Date**: February 26, 2026  
**Status**: Stable, Production Ready  
**Node.js**: 18+ required  
**Browser**: Chrome, Firefox, Safari, Edge (all modern versions)

---

**Happy task managing! 🚀**

Remember: Great work is about managing time, not multitasking. One task at a time. 💪
