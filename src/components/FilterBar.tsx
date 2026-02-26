import React from 'react';
import { TaskCategory } from '../types';

interface FilterBarProps {
  activeFilter: 'all' | 'pending' | 'in-progress' | 'completed';
  activeCategoryFilter: TaskCategory | 'all';
  onFilterChange: (filter: 'all' | 'pending' | 'in-progress' | 'completed') => void;
  onCategoryFilterChange: (category: TaskCategory | 'all') => void;
}

const categoryLabels = {
  all: '📊 Todos',
  meetings: '📅 Reuniões',
  research: '🔍 Pesquisa',
  documents: '📄 Documentos',
  'follow-up': '📞 Follow-up',
  other: '📌 Outros',
};

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  activeCategoryFilter,
  onFilterChange,
  onCategoryFilterChange,
}) => {
  const filters = [
    { key: 'all', label: '📋 Todas' },
    { key: 'pending', label: '⏳ Pendentes' },
    { key: 'in-progress', label: '⚡ Em Andamento' },
    { key: 'completed', label: '✅ Completas' },
  ];

  const categories: (TaskCategory | 'all')[] = ['all', 'meetings', 'research', 'documents', 'follow-up', 'other'];

  return (
    <div className="bg-white rounded-lg border border-apple-200 p-4 shadow-apple-sm">
      {/* Status Filters */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-apple-600 mb-2 uppercase tracking-wide">Status</h3>
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key as any)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                activeFilter === f.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-apple-100 text-apple-700 hover:bg-apple-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div>
        <h3 className="text-xs font-semibold text-apple-600 mb-2 uppercase tracking-wide">Categoria</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onCategoryFilterChange(cat)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                activeCategoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-apple-100 text-apple-700 hover:bg-apple-200'
              }`}
            >
              {categoryLabels[cat as keyof typeof categoryLabels]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
