# Memory Bank - Development Guide & Troubleshooting

## Common Development Tasks

### Adding a New Feature

1. **Identify Impact:** Which component(s) will change?
2. **Update State:** Add to Task interface or new state variable
3. **Update UI:** Modify affected components
4. **Persist Data:** Add localStorage key if needed
5. **Update Translations:** Add new strings to translations.ts
6. **Test:** Verify keyboard shortcuts, drag-drop, translations
7. **Commit:** Push to GitHub

Example: Adding "Priority" field to tasks
```typescript
// 1. Update Task interface in types/index.ts
interface Task {
  // ... existing fields
  priority: 'low' | 'medium' | 'high';
}

// 2. Update CreateTaskModal
// Add priority select input

// 3. Update TaskCard
// Display priority badge/icon

// 4. No new storage key needed (stored in ib_tasks)

// 5. Update translations
translations = {
  pt: { 'priority': 'Prioridade', 'low': 'Baixa', ... },
  en: { 'priority': 'Priority', 'low': 'Low', ... }
}

// 6. Test all features still work

// 7. git add . && git commit -m "Add priority field"
```

### Modifying Timer Logic

If changing how timers work, remember:
1. Single active timer constraint must be maintained
2. Must persist changes to localStorage (`ib_active_task`, task state in `ib_tasks`)
3. UI update frequency vs persistence frequency separation
4. Color border thresholds may need adjustment
5. Test timer pause/resume scenario

### Adding New Column Type

To add a 6th column to Kanban:

```typescript
// 1. Update columnIds type in types/index.ts
type ColumnId = 'incoming' | 'in-progress' | 'waiting' | 'adjusting' | 'completed' | 'review';

// 2. Add to COLUMNS configuration in KanbanBoard.tsx
const COLUMNS = [
  { id: 'incoming', title: 'Incoming' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'waiting', title: 'Waiting' },
  { id: 'adjusting', title: 'Adjusting' },
  { id: 'review', title: 'Review' },  // NEW
  { id: 'completed', title: 'Completed' },
];

// 3. Add keyboard shortcut (6 instead of 5? Or remap existing)
```

## Troubleshooting Guide

### Issue: App Won't Start - "npm run dev" fails

**Symptoms:** Dev server exits with error, port already in use, or build error

**Solutions:**
1. Check if node process still running:
   ```powershell
   Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```
2. Clear cache and reinstall:
   ```powershell
   Remove-Item -Path ".next" -Recurse -Force
   npm install
   npm run dev
   ```
3. Check Node version (need 18+):
   ```powershell
   node --version
   ```

### Issue: Timer Not Persisting

**Symptoms:** Timer data lost after page refresh

**Root Causes & Fixes:**
- Check `ib_tasks` key in localStorage isn't corrupted
- Verify `setTasks()` is being called after timer update
- Ensure localStorage `setItem` is called with proper JSON.stringify()
- Check browser storage quota not exceeded

**Debug:**
```javascript
// In browser console
JSON.parse(localStorage.getItem('ib_tasks')); // View all tasks, check totals
localStorage.getItem('ib_active_task'); // Check active task ID
```

### Issue: Keyboard Shortcuts Not Working

**Symptoms:** Pressing N, Space, 1-5 has no effect

**Root Causes:**
- Focus is on input field → shortcuts intentionally disabled
- Component unmounted → useKeyboardShortcuts not registered
- Event listener not added during mount

**Debug:**
```javascript
// In browser console, check if listener exists
window.addEventListener('keydown', (e) => console.log('Key:', e.key));
// Now try pressing keys
```

### Issue: Language Switch Shows English Text in Portuguese Mode

**Symptoms:** Some UI elements don't translate

**Root Causes:**
- New string added without translations key
- Translation key misspelled in both files
- useTranslation() not called in component

**Fix:**
1. Check all new strings have keys in `translations.ts` for both languages
2. Verify useTranslation hook is used: `const { t } = useTranslation();`
3. Clear localStorage: `localStorage.removeItem('ib_language');`

### Issue: Drag & Drop Not Working

**Symptoms:** Can't drag task cards, or drop doesn't register

**Root Causes:**
- react-beautiful-dnd not properly imported
- Missing Droppable wrapper
- onDragEnd handler not connected

**Debug:**
- Check console for drag/drop errors
- Verify DragDropContext wraps KanbanColumn array
- Ensure TaskCard is inside Draggable component

### Issue: Data Lost After Clearing Browser Cache

**Symptoms:** All tasks disappeared after browser storage clear

**This is Expected Behavior** - localStorage is browser cache:
- Backup: Use browser export before clearing
- Future: Consider export/import feature
- No solution without backend database

### Issue: Git Push Fails

**Symptoms:** "fatal: remote origin not set" or auth errors

**Solutions:**
1. Check remote:
   ```powershell
   git remote -v
   ```
2. Reset remote:
   ```powershell
   git remote set-url origin https://github.com/Bernardomeirelles/ib_task.git
   ```
3. Authenticate:
   ```powershell
   git config --global user.email "you@example.com"
   git config --global user.name "Your Name"
   ```

## Code Quality Checklist

Before committing changes:

- [ ] App starts without errors: `npm run dev`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors or warnings
- [ ] Keyboard shortcuts work
- [ ] Drag & drop works
- [ ] Timer starts/stops correctly
- [ ] Data persists across page reload
- [ ] Language toggle works for all strings
- [ ] Color borders update based on elapsed time
- [ ] Analytics send works for completed tasks
- [ ] No TypeScript errors: `npm run lint`

## Testing Workflow

### Manual Testing Sequence
1. **Create Task:** Press N or button → enter codename → ENTER
2. **Move Task:** Drag to different column or press 1-5
3. **Timer Test:** Select task → press SPACE to toggle timer
4. **Switch Timer:** Start timer on Task A → start timer on Task B → verify A stopped
5. **Drag Update:** Create task in column 1 → drag to column 5 → verify columnId changed
6. **Refresh:** CMD+R → verify all data persists
7. **Language:** Click language toggle → verify UI changes
8. **Analytics:** Move task to Completed → click "Send to Analytics" → verify moved to archive

### Automated Testing (could add later)
```bash
npm install --save-dev @testing-library/react jest
npm test
```

## Performance Profiling

### Check Component Renders
```javascript
// Add to component
useEffect(() => {
  console.log('TaskCard rendered');
}, [task]);
```

### Check localStorage Performance
```javascript
console.time('localStorage');
localStorage.setItem('ib_tasks', JSON.stringify(tasks));
console.timeEnd('localStorage');
// Should be < 5ms
```

### Memory Usage
- Open DevTools → Performance tab
- Record 5s of interaction
- Check memory growth (should be stable)

## Git Workflow

### Daily Workflow
```powershell
# Start work
git pull origin main

# Make changes...

# Check what changed
git status
git diff components/TaskCard.tsx

# Stage and commit
git add .
git commit -m "Add feature description"

# Push
git push origin main
```

### Rollback Changes
```powershell
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View history
git log --oneline -10
```

## Deployment Checklist

Before deploying to production:

- [ ] All features tested locally
- [ ] No console errors
- [ ] Build succeeds: `npm run build`
- [ ] .gitignore includes `.next`, `node_modules`, `.env*`
- [ ] Environment variables set (if any)
- [ ] GitHub has latest code: `git push`
- [ ] No sensitive data in code
- [ ] README.md up to date
- [ ] Deploy to Vercel or host

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Self-Hosted Server
```bash
# On server
git clone https://github.com/Bernardomeirelles/ib_task.git
cd ib_task
npm install
npm run build
npm start  # Runs on port 3000
```

## Future Enhancement Candidates

If user requests new features, consider:

1. **Data Export/Import**
   - CSV export of tasks
   - JSON backup/restore
   - Component: TaskExporter.tsx

2. **Statistics Dashboard**
   - Weekly summary
   - Productivity trends
   - Time allocation pie chart
   - Component: StatisticsView.tsx

3. **Task Templates**
   - Save common task types
   - Quick spawn from template
   - Component: TemplateManager.tsx

4. **Recurring Tasks**
   - Daily standup
   - Weekly review
   - Component: RecurringTaskSettings.tsx

5. **Collaboration** (requires backend)
   - Share board with team
   - Sync across devices
   - Backend: Node/Firebase

6. **Mobile Support**
   - Responsive design improvements
   - Touch-friendly controls
   - Mobile-specific view

## Command Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Check TypeScript/ESLint |
| `git log --oneline -10` | Last 10 commits |
| `git diff` | View unstaged changes |
| `git status` | Current repo status |
| `npm install` | Install dependencies |
| `npm cache clean --force` | Clear npm cache |
| `rm -r .next` | Clear Next.js cache (PowerShell: `Remove-Item .next -Recurse -Force`) |
