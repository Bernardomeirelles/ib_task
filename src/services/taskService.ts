import { Task, Priority, TaskCategory } from '../types';

const STORAGE_KEY = 'ib_tasks';

export const taskService = {
  getTasks: (): Task[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  createTask: (title: string, category: TaskCategory = 'other', priority: Priority = 'medium'): Task => {
    const now = new Date().toISOString();
    return {
      id: Date.now().toString(),
      title,
      priority,
      status: 'pending',
      category,
      createdAt: now,
      updatedAt: now,
    };
  },

  updateTask: (task: Task): Task => {
    return {
      ...task,
      updatedAt: new Date().toISOString(),
    };
  },

  deleteTask: (taskId: string, tasks: Task[]): Task[] => {
    return tasks.filter(t => t.id !== taskId);
  },

  getTasksByStatus: (tasks: Task[], status: string) => {
    return tasks.filter(t => t.status === status);
  },

  getTasksByPriority: (tasks: Task[], priority: Priority) => {
    return tasks.filter(t => t.priority === priority);
  },

  getTasksByCategory: (tasks: Task[], category: TaskCategory) => {
    return tasks.filter(t => t.category === category);
  },

  calculateStats: (tasks: Task[]) => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      pending: tasks.filter(t => t.status === 'pending').length,
    };
  },
};
