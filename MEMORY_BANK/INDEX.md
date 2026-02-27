# 📚 Memory Bank Index

Complete documentation and reference guide for the IB Task Manager project.

## 📖 Documentation Files

### [MEMORY_BANK.md](MEMORY_BANK.md)
**Project Overview & History**
- User requests history (4 phases)
- Current application state
- All resolved issues
- Data model and storage
- Keyboard shortcuts reference
- npm scripts and deployment info
- Session checklist

### [MEMORY_BANK_ARCHITECTURE.md](MEMORY_BANK_ARCHITECTURE.md)
**Technical Deep Dive**
- State management flow
- Single active timer architecture
- Component dependency tree
- Data mutation patterns
- localStorage structure and keys
- Translation system implementation
- Performance considerations

### [MEMORY_BANK_DEVELOPMENT.md](MEMORY_BANK_DEVELOPMENT.md)
**Developer Guide & Troubleshooting**
- How to add new features
- Common issues and solutions
- Code quality checklist
- Testing workflow
- Git workflow guide
- Deployment checklist
- Future enhancement ideas
- Command reference

## 🚀 Quick Links

**Repository:** https://github.com/Bernardomeirelles/ib_task.git

**Current Status:** ✅ Production Ready

**Tech Stack:** Next.js 15.5.12 | React 18.3.1 | TailwindCSS 3.4.1 | TypeScript 5.3.3

## 🎯 Start Here

**New to the project?**
1. Read [MEMORY_BANK.md](MEMORY_BANK.md) for overview
2. Check [MEMORY_BANK_ARCHITECTURE.md](MEMORY_BANK_ARCHITECTURE.md) to understand how it works
3. Use [MEMORY_BANK_DEVELOPMENT.md](MEMORY_BANK_DEVELOPMENT.md) when developing

**Need to troubleshoot?**
→ Jump to [MEMORY_BANK_DEVELOPMENT.md - Troubleshooting](MEMORY_BANK_DEVELOPMENT.md#troubleshooting-guide)

**Want to add a feature?**
→ Check [MEMORY_BANK_DEVELOPMENT.md - Common Tasks](MEMORY_BANK_DEVELOPMENT.md#common-development-tasks)

## 📋 Key Information

### Features
- 5-Column Kanban Board
- Real-time Single Active Timer
- Per-task timer breakdown (Doing/Waiting/Fixing)
- Analytics with project archive
- Keyboard shortcuts (N, Space, 1-5)
- Drag & drop support
- Portuguese/English language support
- 100% offline (LocalStorage)

### Storage
```
ib_tasks              → All task data
ib_active_task        → Currently active task ID
ib_analytics          → Archived project data
ib_language           → Language preference (pt/en)
```

### Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Check code quality
```

## 📝 Last Updated
February 27, 2026

---

**For questions, refer to the specific memory bank file or check troubleshooting section.**
