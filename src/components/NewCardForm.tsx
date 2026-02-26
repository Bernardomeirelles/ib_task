import React, { useState } from 'react';

interface NewCardFormProps {
  onSubmit: (codename: string, staffingTime: string) => void;
  onCancel: () => void;
}

export const NewCardForm: React.FC<NewCardFormProps> = ({ onSubmit, onCancel }) => {
  const [codename, setCodename] = useState('');
  const [staffingTime, setStaffingTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codename.trim() || !staffingTime.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(codename.trim(), staffingTime.trim());
      setCodename('');
      setStaffingTime('');
      setIsSubmitting(false);
    }, 200);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 rounded-xl border border-blue-500/30 p-8 w-96 shadow-card backdrop-blur-sm animate-scale-in">
        <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Create New Staffing
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Task Codename */}
          <div>
            <label className="block text-blue-300 text-sm font-bold mb-2 uppercase tracking-wide">
              Task Codename *
            </label>
            <input
              autoFocus
              type="text"
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              placeholder="e.g. Project Falcon, Deck Update"
              className="w-full bg-slate-700/50 border border-blue-500/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 focus:shadow-glow-blue text-sm transition-all duration-300 placeholder-gray-500"
              maxLength={50}
              disabled={isSubmitting}
            />
            <p className="text-gray-500 text-xs mt-1.5 flex justify-between">
              <span>Short name for the assignment</span>
              <span>{codename.length}/50</span>
            </p>
          </div>

          {/* Staffing Time */}
          <div>
            <label className="block text-blue-300 text-sm font-bold mb-2 uppercase tracking-wide">
              Staffing Time (HH:MM) *
            </label>
            <input
              type="text"
              value={staffingTime}
              onChange={(e) => {
                let val = e.target.value.replace(/[^0-9:]/g, '');
                if (val.length > 5) val = val.slice(0, 5);
                setStaffingTime(val);
              }}
              placeholder="09:30"
              maxLength={5}
              className="w-full bg-slate-700/50 border border-blue-500/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 focus:shadow-glow-blue text-sm font-mono transition-all duration-300 placeholder-gray-500"
              disabled={isSubmitting}
            />
            <p className="text-gray-500 text-xs mt-1.5">When were you assigned to this task?</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8 pt-4 border-t border-gray-700/50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-glow-blue disabled:shadow-none disabled:cursor-not-allowed"
            >
              {isSubmitting ? '✓ Creating...' : '+ Create Staffing'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
