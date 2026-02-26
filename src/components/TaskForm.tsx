import React, { useState } from 'react';
import { Task, Priority, TaskCategory } from '../types';

interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (task: Partial<Task>) => void;
  onCancel: () => void;
}

const priorities: Priority[] = ['low', 'medium', 'high'];
const categories: TaskCategory[] = ['meetings', 'research', 'documents', 'follow-up', 'other'];

export const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [priority, setPriority] = useState<Priority>(initialTask?.priority || 'medium');
  const [category, setCategory] = useState<TaskCategory>(initialTask?.category || 'other');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '');
  const [estHours, setEstHours] = useState(initialTask?.estHours || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
      estHours: estHours ? parseFloat(estHours) : undefined,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('other');
    setDueDate('');
    setEstHours('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-apple-200 p-6 shadow-apple-sm">
      <h2 className="text-lg font-semibold text-apple-800 mb-4">
        {initialTask ? 'Editar Tarefa' : 'Nova Tarefa'}
      </h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-apple-700 mb-2">
            Título *
          </label>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Análise de valuation para cliente XYZ"
            className="w-full px-3 py-2 border border-apple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-apple-700 mb-2">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes adicionais..."
            className="w-full px-3 py-2 border border-apple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none h-20"
            maxLength={500}
          />
        </div>

        {/* Priority & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-apple-700 mb-2">
              Prioridade
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 border border-apple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {priorities.map(p => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-700 mb-2">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full px-3 py-2 border border-apple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Due Date & Estimated Hours */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-apple-700 mb-2">
              Data de Vencimento
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-apple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-700 mb-2">
              Horas Estimadas
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={estHours}
              onChange={(e) => setEstHours(e.target.value)}
              placeholder="Ex: 2.5"
              className="w-full px-3 py-2 border border-apple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {initialTask ? 'Atualizar' : 'Criar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-apple-100 text-apple-700 rounded-lg font-medium hover:bg-apple-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
