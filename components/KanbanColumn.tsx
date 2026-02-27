'use client';

import React from 'react';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface KanbanColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  taskTimers: Record<string, number>;
  onToggleTimer: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdateNotes: (taskId: string, notes: string) => void;
  onSendToAnalytics: (taskId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  columnId,
  title,
  tasks,
  taskTimers,
  onToggleTimer,
  onDelete,
  onUpdateNotes,
  onSendToAnalytics,
}) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`bg-dark-bg rounded-lg p-4 min-h-96 flex flex-col transition ${
            snapshot.isDraggingOver ? 'bg-opacity-50 ring-2 ring-neutral-600' : ''
          }`}
        >
          <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
            {title}
            <span className="ml-2 text-xs text-neutral-400 font-normal">({tasks.length})</span>
          </h2>

          <div className="space-y-2 flex-1">
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-neutral-500 text-sm">
                No tasks
              </div>
            ) : (
              tasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id}
                  index={index}
                  isDragDisabled={task.columnId === 'completed'}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition ${
                        snapshot.isDragging ? 'opacity-50 shadow-lg' : ''
                      }`}
                    >
                      <TaskCard
                        task={task}
                        elapsedTime={taskTimers[task.id] || 0}
                        onToggleTimer={onToggleTimer}
                        onDelete={onDelete}
                        onUpdateNotes={onUpdateNotes}
                        onSendToAnalytics={onSendToAnalytics}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
          </div>

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
