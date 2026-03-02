'use client';

import React, { useState } from 'react';
import { AnalyticsEntry } from '@/types';
import { formatTime } from '@/utils/timeUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronLeft } from 'lucide-react';

interface AnalyticsViewProps {
  entries: AnalyticsEntry[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ entries }) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  const totalTasks = entries.length;
  const totalTime = entries.reduce((sum, entry) => sum + entry.totalTime, 0);
  const avgTime = totalTasks > 0 ? Math.floor(totalTime / totalTasks) : 0;
  const longestTask = totalTasks
    ? entries.reduce((max, entry) => (entry.totalTime > max.totalTime ? entry : max), entries[0])
    : null;

  // Calculate data by project
  const projectData = React.useMemo(() => {
    return entries.map((entry) => ({
      name: entry.codename,
      time: entry.totalTime,
      doing: entry.doingTime,
      waiting: entry.waitingTime,
      fixing: entry.fixingTime,
      full: entry,
    }));
  }, [entries]);

  const selectedProjectData = selectedProject 
    ? entries.find((e) => e.codename === selectedProject)
    : null;

  const projectTimeBreakdown = selectedProjectData
    ? [
        { name: 'Doing', value: selectedProjectData.doingTime, color: '#E60000' },
        { name: 'Fixing', value: selectedProjectData.fixingTime, color: '#7C3AED' },
        { name: 'Waiting', value: selectedProjectData.waitingTime, color: '#F59E0B' },
      ].filter((item) => item.value > 0)
    : [];

  const projectTimePercentages = selectedProjectData
    ? [
        {
          name: 'Doing',
          value: selectedProjectData.doingTime,
          percentage: ((selectedProjectData.doingTime / (selectedProjectData.doingTime + selectedProjectData.waitingTime + selectedProjectData.fixingTime)) * 100).toFixed(1),
        },
        {
          name: 'Fixing',
          value: selectedProjectData.fixingTime,
          percentage: ((selectedProjectData.fixingTime / (selectedProjectData.doingTime + selectedProjectData.waitingTime + selectedProjectData.fixingTime)) * 100).toFixed(1),
        },
        {
          name: 'Waiting',
          value: selectedProjectData.waitingTime,
          percentage: ((selectedProjectData.waitingTime / (selectedProjectData.doingTime + selectedProjectData.waitingTime + selectedProjectData.fixingTime)) * 100).toFixed(1),
        },
      ]
    : [];

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-600">Tarefas arquivadas</p>
        </div>
      </div>

      {/* Stats Cards - Compact */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalTasks}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Tempo Total</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{formatTime(totalTime)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Média</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{formatTime(avgTime)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Mais Longo</p>
          <p className="text-lg font-semibold text-gray-900 mt-2 truncate">
            {longestTask ? longestTask.codename : '—'}
          </p>
          <p className="text-sm text-gray-600">
            {longestTask ? formatTime(longestTask.totalTime) : '—'}
          </p>
        </div>
      </div>

      {/* Project Time Chart or Project Breakdown */}
      {selectedProjectData ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar aos Projetos
          </button>

          <h3 className="text-lg font-bold text-gray-900 mb-6">
            {selectedProjectData.codename}
          </h3>

          <div className="grid grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={projectTimeBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {projectTimeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatTime(value)}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#111827',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Percentages */}
            <div className="flex flex-col justify-center space-y-5">
              {projectTimePercentages.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                    <span className="text-lg font-bold text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        item.name === 'Doing'
                          ? 'bg-[#E60000]'
                          : item.name === 'Fixing'
                            ? 'bg-violet-500'
                            : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 font-mono">{formatTime(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {/* Bar Chart - 2/3 width */}
          <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tempo por Projeto</h3>
            {projectData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Nenhum projeto arquivado
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={projectData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" style={{ fontSize: '11px' }} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="#6b7280" 
                      style={{ fontSize: '10px' }} 
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        color: '#111827',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                      formatter={(value: number) => formatTime(value)}
                      cursor={{ fill: 'rgba(230, 0, 0, 0.05)' }}
                    />
                    <Bar dataKey="doing" fill="#E60000" stackId="a" name="Doing" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="fixing" fill="#7C3AED" stackId="a" name="Fixing" />
                    <Bar dataKey="waiting" fill="#F59E0B" stackId="a" name="Waiting" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Clique em um projeto para ver detalhes
                </p>
              </>
            )}
          </div>

          {/* Project List - 1/3 width */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Projetos</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                {totalTasks}
              </span>
            </div>

            {totalTasks === 0 ? (
              <div className="text-sm text-gray-500 text-center py-8">
                Nenhuma tarefa arquivada
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {projectData.map((project) => (
                  <div
                    key={project.name}
                    onClick={() => setSelectedProject(project.name)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 cursor-pointer transition group"
                  >
                    <div className="font-semibold text-sm text-gray-900 group-hover:text-red-600 truncate mb-2">
                      {project.name}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Doing:</span>
                        <span className="font-mono text-red-600">{formatTime(project.doing)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Fixing:</span>
                        <span className="font-mono text-violet-600">{formatTime(project.fixing)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Waiting:</span>
                        <span className="font-mono text-amber-600">{formatTime(project.waiting)}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-1 border-t border-gray-200">
                        <span className="text-gray-900 font-semibold">Total:</span>
                        <span className="font-mono font-bold text-gray-900">{formatTime(project.time)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
