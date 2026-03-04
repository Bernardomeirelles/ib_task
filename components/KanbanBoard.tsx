'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Task, Column, AnalyticsEntry } from '@/types';
import { TopNavBar } from './TopNavBar';
import { KanbanColumn } from './KanbanColumn';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskSelector } from './TaskSelector';
import { AnalyticsView } from './AnalyticsView';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useScreenWakeLock } from '@/hooks/useScreenWakeLock';
import { Plus } from 'lucide-react';

const COLUMNS: Column[] = [
  { id: 'incoming', title: 'Backlog' },
  { id: 'in-progress', title: 'Fazendo' },
  { id: 'waiting', title: 'Aguardando Comentários' },
  { id: 'adjusting-comments', title: 'Correção' },
  { id: 'completed', title: 'Feito' },
];

interface StoredData {
  tasks: Task[];
  lastSyncTime: number;
}

export const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('ib_tasks', []);
  const [activeTaskId, setActiveTaskId] = useLocalStorage<string | null>('ib_active_task', null);
  const [showModal, setShowModal] = useState(false);
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [taskTimers, setTaskTimers] = useState<Record<string, number>>({});
  const [analyticsEntries, setAnalyticsEntries] = useLocalStorage<AnalyticsEntry[]>(
    'ib_analytics',
    []
  );
  const [activeTab, setActiveTab] = useState<'board' | 'analytics'>('board');
  const [username, setUsername] = useState<string>('Usuário');

  // Fetch username
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUsername(data.username))
      .catch(() => setUsername('Usuário'));
  }, []);

  // Keep screen awake
  useScreenWakeLock();

  // Use ref to track tasks without causing re-renders
  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  // Initialize timers from localStorage
  useEffect(() => {
    const timers: Record<string, number> = {};
    const now = Date.now();

    tasks.forEach((task) => {
      let time = 0;
      if (task.activeTimerType === 'doing') time = task.doingTime;
      else if (task.activeTimerType === 'waiting') time = task.waitingTime;
      else if (task.activeTimerType === 'fixing') time = task.fixingTime;
      else time = task.doingTime + task.fixingTime;

      if (task.isActive && task.timerStartedAt) {
        const elapsedSeconds = Math.floor((now - task.timerStartedAt) / 1000);
        timers[task.id] = time + elapsedSeconds;
      } else {
        timers[task.id] = time;
      }
    });

    setTaskTimers(timers);
  }, [tasks]);

  // Timer update interval - using ref to avoid recreating interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTaskTimers((prev) => {
        const updated = { ...prev };
        let hasChanges = false;
        tasksRef.current.forEach((task) => {
          if (task.isActive && task.id in updated) {
            updated[task.id] = (updated[task.id] || 0) + 1;
            hasChanges = true;
          }
        });
        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-save active tasks periodically - optimized
  const activeTaskIdRef = useRef(activeTaskId);
  useEffect(() => {
    activeTaskIdRef.current = activeTaskId;
  }, [activeTaskId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentActiveTaskId = activeTaskIdRef.current;
      if (currentActiveTaskId) {
        const activeTask = tasksRef.current.find((t) => t.id === currentActiveTaskId);
        // If active task doesn't exist anymore, clear the activeTaskId
        if (!activeTask) {
          setActiveTaskId(null);
          return;
        }
        
        if (activeTask.isActive && activeTask.timerStartedAt) {
          const elapsedSeconds = Math.floor((Date.now() - activeTask.timerStartedAt) / 1000);
          const updatedTask = { ...activeTask };
          
          if (activeTask.activeTimerType === 'doing') {
            updatedTask.doingTime = (activeTask.doingTime || 0);
          } else if (activeTask.activeTimerType === 'waiting') {
            updatedTask.waitingTime = (activeTask.waitingTime || 0);
          } else if (activeTask.activeTimerType === 'fixing') {
            updatedTask.fixingTime = (activeTask.fixingTime || 0);
          }
          
          // Update task in localStorage
          setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === currentActiveTaskId ? updatedTask : t))
          );
        }
      }
    }, 10000); // Save every 10 seconds instead of 5

    return () => clearInterval(interval);
  }, [setTasks, setActiveTaskId]);

  const updateTaskInStorage = useCallback(
    (updatedTask: Task) => {
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    },
    [setTasks]
  );

  const handleToggleTimer = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task || task.columnId === 'completed') return;

      // If this is a new active task, stop the previous one
      if (!task.isActive && activeTaskId && activeTaskId !== taskId) {
        const previousTask = tasks.find((t) => t.id === activeTaskId);
        if (previousTask) {
          const currentTime = Math.floor((Date.now() - (previousTask.timerStartedAt || 0)) / 1000);
          let updatedPrev = { ...previousTask, isActive: false, timerStartedAt: null };
          
          if (previousTask.activeTimerType === 'doing') {
            updatedPrev.doingTime += currentTime;
          } else if (previousTask.activeTimerType === 'waiting') {
            updatedPrev.waitingTime += currentTime;
          } else if (previousTask.activeTimerType === 'fixing') {
            updatedPrev.fixingTime += currentTime;
          }
          
          updateTaskInStorage(updatedPrev);
        }
      }

      // Toggle current task
      if (task.isActive) {
        // Pausing
        const currentTime = Math.floor((Date.now() - (task.timerStartedAt || 0)) / 1000);
        let updatedTask = { ...task, isActive: false, timerStartedAt: null };
        
        if (task.activeTimerType === 'doing') {
          updatedTask.doingTime += currentTime;
        } else if (task.activeTimerType === 'waiting') {
          updatedTask.waitingTime += currentTime;
        } else if (task.activeTimerType === 'fixing') {
          updatedTask.fixingTime += currentTime;
        }
        
        updateTaskInStorage(updatedTask);
        setActiveTaskId(null);
      } else {
        // Starting
        let timerType: 'doing' | 'waiting' | 'fixing' = 'doing';
        if (task.columnId === 'waiting') timerType = 'waiting';
        else if (task.columnId === 'adjusting-comments') timerType = 'fixing';
        
        updateTaskInStorage({
          ...task,
          isActive: true,
          timerStartedAt: Date.now(),
          activeTimerType: timerType,
        });
        setActiveTaskId(taskId);
      }
    },
    [tasks, activeTaskId, setActiveTaskId, updateTaskInStorage]
  );

  const handleCreateTask = useCallback(
    (newTaskData: Omit<Task, 'id' | 'createdAt' | 'doingTime' | 'waitingTime' | 'fixingTime' | 'isActive' | 'timerStartedAt' | 'activeTimerType'>) => {
      const newTask: Task = {
        ...newTaskData,
        id: Date.now().toString(),
        createdAt: Date.now(),
        doingTime: 0,
        waitingTime: 0,
        fixingTime: 0,
        isActive: false,
        timerStartedAt: null,
        activeTimerType: null,
      };

      setTasks((prev) => [...prev, newTask]);
    },
    [setTasks]
  );

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      // Clear active task before removing if it's the one being deleted
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
      
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setTaskTimers((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
    },
    [setTasks, activeTaskId, setActiveTaskId]
  );

  const handleUpdateNotes = useCallback(
    (taskId: string, notes: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        updateTaskInStorage({ ...task, notes });
      }
    },
    [tasks, updateTaskInStorage]
  );

  const handleSendToAnalytics = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task || task.columnId !== 'completed') return;

      let doingTime = task.doingTime;
      let waitingTime = task.waitingTime;
      let fixingTime = task.fixingTime;

      // If task is still actively timing, add elapsed time
      if (task.isActive && task.timerStartedAt) {
        const currentTime = Math.floor((Date.now() - task.timerStartedAt) / 1000);
        if (task.activeTimerType === 'doing') doingTime += currentTime;
        else if (task.activeTimerType === 'waiting') waitingTime += currentTime;
        else if (task.activeTimerType === 'fixing') fixingTime += currentTime;
      }

      const totalTime = doingTime + fixingTime; // Waiting doesn't count toward total
      const completedAt = Date.now();
      const sla = completedAt - task.createdAt; // Total staffing time from created to completed

      const entry: AnalyticsEntry = {
        id: task.id,
        codename: task.codename,
        staffingTime: task.staffingTime,
        notes: task.notes,
        createdAt: task.createdAt,
        completedAt,
        doingTime,
        waitingTime,
        fixingTime,
        totalTime,
        sla: Math.floor(sla / 1000), // Convert to seconds
      };

      setAnalyticsEntries((prev) => [entry, ...prev]);
      
      // Clear active task before removing
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
      
      // Remove task from tasks and clean up its timer
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setTaskTimers((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
    },
    [tasks, activeTaskId, setActiveTaskId, setAnalyticsEntries, setTasks]
  );

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    const newColumnId = destination.droppableId as Task['columnId'];
    let updatedTask = { ...task, columnId: newColumnId };

    // Handle timer transitions
    if (task.isActive && task.timerStartedAt) {
      const currentTime = Math.floor((Date.now() - task.timerStartedAt) / 1000);
      
      // Pause the current timer
      if (task.activeTimerType === 'doing') {
        updatedTask.doingTime += currentTime;
      } else if (task.activeTimerType === 'waiting') {
        updatedTask.waitingTime += currentTime;
      } else if (task.activeTimerType === 'fixing') {
        updatedTask.fixingTime += currentTime;
      }

      // Start new timer based on destination column
      if (newColumnId === 'waiting' && task.activeTimerType !== 'waiting') {
        updatedTask.isActive = true;
        updatedTask.timerStartedAt = Date.now();
        updatedTask.activeTimerType = 'waiting';
      } else if (newColumnId === 'adjusting-comments' && task.activeTimerType !== 'fixing') {
        updatedTask.isActive = true;
        updatedTask.timerStartedAt = Date.now();
        updatedTask.activeTimerType = 'fixing';
      } else if (newColumnId === 'completed') {
        updatedTask.isActive = false;
        updatedTask.timerStartedAt = null;
        updatedTask.activeTimerType = null;
        setActiveTaskId(null);
      } else if (newColumnId === 'in-progress' && task.activeTimerType !== 'doing') {
        updatedTask.isActive = true;
        updatedTask.timerStartedAt = Date.now();
        updatedTask.activeTimerType = 'doing';
      }
    }

    updateTaskInStorage(updatedTask);
  };

  const handleMoveColumn = (columnIndex: number) => {
    if (columnIndex < 0 || columnIndex >= COLUMNS.length) return;

    const activeTask = tasks.find((t) => t.id === activeTaskId);
    if (!activeTask) return;

    const newColumnId = COLUMNS[columnIndex].id as Task['columnId'];
    let updatedTask = { ...activeTask, columnId: newColumnId };

    // Handle timer transitions
    if (activeTask.isActive && activeTask.timerStartedAt) {
      const currentTime = Math.floor((Date.now() - activeTask.timerStartedAt) / 1000);
      
      // Pause the current timer
      if (activeTask.activeTimerType === 'doing') {
        updatedTask.doingTime += currentTime;
      } else if (activeTask.activeTimerType === 'waiting') {
        updatedTask.waitingTime += currentTime;
      } else if (activeTask.activeTimerType === 'fixing') {
        updatedTask.fixingTime += currentTime;
      }

      // Start new timer based on destination column
      if (newColumnId === 'waiting' && activeTask.activeTimerType !== 'waiting') {
        updatedTask.isActive = true;
        updatedTask.timerStartedAt = Date.now();
        updatedTask.activeTimerType = 'waiting';
      } else if (newColumnId === 'adjusting-comments' && activeTask.activeTimerType !== 'fixing') {
        updatedTask.isActive = true;
        updatedTask.timerStartedAt = Date.now();
        updatedTask.activeTimerType = 'fixing';
      } else if (newColumnId === 'completed') {
        updatedTask.isActive = false;
        updatedTask.timerStartedAt = null;
        updatedTask.activeTimerType = null;
        setActiveTaskId(null);
      } else if (newColumnId === 'in-progress' && activeTask.activeTimerType !== 'doing') {
        updatedTask.isActive = true;
        updatedTask.timerStartedAt = Date.now();
        updatedTask.activeTimerType = 'doing';
      }
    }

    updateTaskInStorage(updatedTask);
  };

  const handleSelectTask = useCallback(
    (taskId: string) => {
      setShowTaskSelector(false);
      handleToggleTimer(taskId);
    },
    [handleToggleTimer]
  );

  useKeyboardShortcuts({
    onNewTask: () => setShowModal(true),
    onToggleTimer: () => {
      if (activeTaskId) {
        handleToggleTimer(activeTaskId);
      }
    },
    onMoveColumn: handleMoveColumn,
    onOpenTaskSelector: () => setShowTaskSelector(true),
  });

  const totalTimeToday = Object.values(taskTimers).reduce((sum, time) => sum + time, 0);
  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;
  const activeTasks = tasks.filter((t) => t.columnId !== 'completed').length;

  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-hidden">
      <TopNavBar activeTask={activeTask} totalTimeToday={totalTimeToday} activeTasks={activeTasks} allTasks={tasks} />

      {/* Logo Section */}
      <div className="px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image 
            src="/ubs-logo.svg" 
            alt="UBS Logo" 
            width={120} 
            height={60}
            className="h-10 w-auto"
          />
          <div className="text-gray-700 text-sm">
            Olá, <span className="font-semibold">{username}</span>, seja bem-vindo.
          </div>
        </div>
      </div>

      <div className="px-6 pt-4">
        <div className="inline-flex bg-gray-100 border border-gray-300 rounded">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-4 py-2 text-sm rounded-l transition ${
              activeTab === 'board'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            Board
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-sm rounded-r transition ${
              activeTab === 'analytics'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'board' ? (
          <DragDropContext key="kanban-dnd-context" onDragEnd={handleDragEnd}>
            <div className="p-4 grid grid-cols-5 gap-4 min-h-full">
              {COLUMNS.map((column) => {
                const columnTasks = tasks.filter((t) => t.columnId === column.id);
                return (
                  <KanbanColumn
                    key={column.id}
                    columnId={column.id}
                    title={column.title}
                    tasks={columnTasks}
                    taskTimers={taskTimers}
                    onToggleTimer={handleToggleTimer}
                    onDelete={handleDeleteTask}
                    onUpdateNotes={handleUpdateNotes}
                    onSendToAnalytics={handleSendToAnalytics}
                  />
                );
              })}
            </div>
          </DragDropContext>
        ) : (
          <AnalyticsView entries={analyticsEntries} />
        )}
      </div>

      {activeTab === 'board' && (
        <>
          {/* Floating Action Button */}
          <button
            onClick={() => setShowModal(true)}
            className="fixed bottom-6 right-6 p-4 bg-green-status text-black rounded-full hover:bg-opacity-90 shadow-lg transition"
            title="New task (N)"
          >
            <Plus className="w-6 h-6" />
          </button>

          <CreateTaskModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onCreate={handleCreateTask}
          />

          <TaskSelector
            isOpen={showTaskSelector}
            onClose={() => setShowTaskSelector(false)}
            tasks={tasks}
            onSelectTask={handleSelectTask}
          />
        </>
      )}
    </div>
  );
};
