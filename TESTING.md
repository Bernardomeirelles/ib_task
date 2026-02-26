# 🧪 Testing Guide - IB Staffing Board

## Quick Test Checklist

### 1. **Create a New Staffing**
- [ ] Click "+ NEW STAFFING" button in header
- [ ] Modal appears with form
- [ ] Enter Task Codename: "Project Falcon"
- [ ] Enter Staffing Time: "09:30"
- [ ] Click "Create Staffing"
- [ ] Card appears in "INCOMING" column

### 2. **Timer Functionality**
- [ ] Click "▶ START" button on the card
- [ ] Timer begins counting (HH:MM:SS format)
- [ ] Active indicator shows "⏱️ RUNNING"
- [ ] Status bar shows +1 Active task
- [ ] Create another staffing and start its timer
- [ ] First timer automatically pauses
- [ ] Only one timer runs at a time ✅

### 3. **Urgency Color System**
- [ ] Start a timer on a staffing
- [ ] Wait 30 minutes (or manually edit elapsed time in DevTools localStorage)
  - 0-30 min: Green border
  - 30-90 min: Yellow border
  - 90-180 min: Orange border
  - 180+ min: Red border + pulsing animation
- [ ] Colors should update based on elapsed time

### 4. **Timer Controls**
- [ ] Click "⏸ PAUSE" to pause the running timer
- [ ] Timer stops counting
- [ ] Status changes to "⏸️ PAUSED"
- [ ] Click "▶ START" again to resume
- [ ] Time continues from where it was paused ✅
- [ ] Click "🔄 RESET" to reset timer to 00:00:00
- [ ] All elapsed time is cleared

### 5. **Drag & Drop Between Columns**
- [ ] Drag a card from INCOMING to IN PROGRESS
- [ ] Card moves to new column
- [ ] Try dragging to WAITING / COMMENTS
- [ ] Try dragging to COMPLETED
- [ ] Card moves smoothly without losing data ✅

### 6. **Add/Edit Notes**
- [ ] Click "📝 Add Notes" on a card
- [ ] Notes textarea appears
- [ ] Type some text: "Follow up with VP"
- [ ] Click "Save"
- [ ] Notes are saved and displayed
- [ ] Click "Edit Notes" again
- [ ] Previous text is there
- [ ] Edit and save again ✅

### 7. **Delete Card**
- [ ] Click "✕" button on a card
- [ ] Card is removed from board
- [ ] Cannot be recovered (permanent delete)
- [ ] Total count decreases ✅

### 8. **Persistence (LocalStorage)**
- [ ] Create 3 staffings with different states:
  - One in INCOMING
  - One with running timer in IN PROGRESS
  - One in COMPLETED
- [ ] Refresh the page (F5 or Cmd+R)
- [ ] All staffings are still there
- [ ] Timer that was running continues from same elapsed time
- [ ] Notes are preserved ✅
- [ ] Column positions are preserved

### 9. **Status Bar**
- [ ] Check header shows correct counts:
  - **Active**: Number currently with running timers
  - **Total**: Total staffings created
  - **Done**: Number in COMPLETED column
- [ ] Counts update in real-time as you create/delete/move cards ✅

### 10. **Offline Functionality**
- [ ] Disconnect internet (or use DevTools offline mode)
- [ ] Create new staffing
- [ ] Start timer
- [ ] Add notes
- [ ] Drag cards
- [ ] All features work without internet ✅
- [ ] Reconnect internet
- [ ] Everything still works

### 11. **Dark Mode Visual Check**
- [ ] UI uses dark colors (slate-900, slate-950)
- [ ] Text is readable with good contrast
- [ ] Urgency colors are visible and distinct
- [ ] No eye strain on dark theme ✅
- [ ] Bloomberg Terminal aesthetic is apparent

### 12. **Column Headers**
- [ ] INCOMING shows "📥 INCOMING"
- [ ] IN PROGRESS shows "⚡ IN PROGRESS"
- [ ] WAITING / COMMENTS shows "⏳ WAITING / COMMENTS"
- [ ] COMPLETED shows "✅ COMPLETED"
- [ ] Each shows task count badge

## 🎯 Test Scenarios

### Scenario A: Typical Workday
1. Manager assigns you 3 staffings (9:30am, 10:15am, 11:00am)
2. You create cards for each
3. Start timer on first one (Project Falcon)
4. After 45 mins, move it to WAITING (needs VP feedback)
5. Start second staffing (Deck Update) timer
6. After 1.5 hours, card turns orange
7. Manager tells you to complete it - move to COMPLETED
8. Timer stops automatically
9. Start third staffing

### Scenario B: Reload During Work
1. Create 2 staffings
2. Start timer on first one
3. Let it run for 5 minutes
4. Refresh page
5. Timer still shows ~5 minutes elapsed
6. Timer continues running from that point
7. No data loss

### Scenario C: Multiple Concurrent Staffings
1. Create 5 staffings with different staffing times
2. Drag some to IN PROGRESS, some to WAITING
3. Start timer on different ones repeatedly
4. Verify only one runs at a time
5. Delete one
6. Verify count updates

## 📊 Performance Metrics

- **Load Time**: Should be < 1 second
- **Timer Accuracy**: Should be within ±1 second
- **Drag & Drop**: Should feel smooth (60fps)
- **Scroll Performance**: Should be smooth even with 20+ cards
- **Memory**: Should stay < 50MB

## 🐛 Known Limitations (v1.0)

- Only one analyst workspace (personal use)
- No multi-user sync
- No keyboard shortcuts (in development)
- No sound alerts on critical time (feature request)
- No export/reports (feature request)

## ✅ Test Results

Date: ___________
Tester: ___________

| Test | Status | Notes |
|------|--------|-------|
| Create Card | ✅ / ❌ | |
| Timer Start/Pause | ✅ / ❌ | |
| Urgency Colors | ✅ / ❌ | |
| Drag & Drop | ✅ / ❌ | |
| Notes | ✅ / ❌ | |
| Delete Card | ✅ / ❌ | |
| Persistence | ✅ / ❌ | |
| Offline | ✅ / ❌ | |
| UI/UX | ✅ / ❌ | |
| Performance | ✅ / ❌ | |

## 💬 Feedback

Any issues or feature requests?
- Check browser console for errors (F12)
- Test in different browsers (Chrome, Firefox, Safari, Edge)
- Report layout issues on different screen sizes

---

**Ready to test!** 🚀
