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
        { name: 'Doing', value: selectedProjectData.doingTime, color: '#3b82f6' },
        { name: 'Fixing', value: selectedProjectData.fixingTime, color: '#8b5cf6' },
        { name: 'Waiting', value: selectedProjectData.waitingTime, color: '#f59e0b' },
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
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Analytics</h2>
          <p className="text-sm text-neutral-400">Archived completed tasks only</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-dark-surface border border-dark-border rounded p-3">
          <p className="text-xs text-neutral-400">Total Archived</p>
          <p className="text-xl font-semibold text-white">{totalTasks}</p>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded p-3">
          <p className="text-xs text-neutral-400">Total Time</p>
          <p className="text-xl font-semibold text-white">{formatTime(totalTime)}</p>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded p-3">
          <p className="text-xs text-neutral-400">Average Time</p>
          <p className="text-xl font-semibold text-white">{formatTime(avgTime)}</p>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded p-3">
          <p className="text-xs text-neutral-400">Longest Task</p>
          <p className="text-xs font-semibold text-white truncate">
            {longestTask ? longestTask.codename : '—'}
          </p>
          <p className="text-xs text-neutral-400">
            {longestTask ? formatTime(longestTask.totalTime) : '—'}
          </p>
        </div>
      </div>

      {/* Project Time Chart or Project Breakdown */}
      {selectedProjectData ? (
        <div className="bg-dark-surface border border-dark-border rounded p-4">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-4 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Projects
          </button>

          <h3 className="text-sm font-semibold text-white mb-6">
            {selectedProjectData.codename} - Time Breakdown
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={projectTimeBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {projectTimeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatTime(value)}
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #2d3748',
                      borderRadius: '6px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Percentages */}
            <div className="flex flex-col justify-center space-y-4">
              {projectTimePercentages.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{item.name}</span>
                    <span className="text-sm font-semibold text-white">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        item.name === 'Doing'
                          ? 'bg-blue-500'
                          : item.name === 'Fixing'
                            ? 'bg-purple-500'
                            : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-neutral-400">{formatTime(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-dark-surface border border-dark-border rounded p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Projects Time</h3>
          {projectData.length === 0 ? (
            <div className="text-sm text-neutral-500">No projects archived yet. Click on a project to see breakdown.</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={projectData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis type="category" dataKey="name" stroke="#9CA3AF" style={{ fontSize: '11px' }} width={195} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1f3a',
                    border: '1px solid #2d3748',
                    borderRadius: '6px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: number) => formatTime(value)}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                  onClick={(state) => {
                    if (state.payload && state.payload[0]) {
                      setSelectedProject(state.payload[0].payload.name);
                    }
                  }}
                />
                <Bar dataKey="doing" fill="#3b82f6" stackId="a" name="Doing" />
                <Bar dataKey="fixing" fill="#8b5cf6" stackId="a" name="Fixing" />
                <Bar dataKey="waiting" fill="#f59e0b" stackId="a" name="Waiting" />
              </BarChart>
            </ResponsiveContainer>
          )}
          <p className="text-xs text-neutral-500 mt-4 text-center">Click on a project bar to see time breakdown</p>
        </div>
      )}

      {/* Projects Clickable List */}
      {!selectedProjectData && (
        <div className="bg-dark-surface border border-dark-border rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">All Projects</h3>
            <p className="text-xs text-neutral-400">{totalTasks} total</p>
          </div>

          {totalTasks === 0 ? (
            <div className="text-sm text-neutral-500">No tasks archived yet.</div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-neutral-400 border-b border-dark-border">
                    <th className="text-left font-medium py-2">Project</th>
                    <th className="text-left font-medium py-2">Doing</th>
                    <th className="text-left font-medium py-2">Fixing</th>
                    <th className="text-left font-medium py-2">Waiting</th>
                    <th className="text-left font-medium py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.map((project) => (
                    <tr
                      key={project.name}
                      className="border-b border-dark-border last:border-0 hover:bg-dark-bg/50 cursor-pointer transition"
                      onClick={() => setSelectedProject(project.name)}
                    >
                      <td className="py-2 text-white font-medium">{project.name}</td>
                      <td className="py-2 text-blue-400 font-mono text-xs">{formatTime(project.doing)}</td>
                      <td className="py-2 text-purple-400 font-mono text-xs">{formatTime(project.fixing)}</td>
                      <td className="py-2 text-amber-400 font-mono text-xs">{formatTime(project.waiting)}</td>
                      <td className="py-2 text-white font-mono text-xs font-semibold">{formatTime(project.time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
