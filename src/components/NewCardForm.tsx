import React, { useState } from 'react';

interface NewCardFormProps {
  onSubmit: (codename: string, staffingTime: string) => void;
  onCancel: () => void;
}

export const NewCardForm: React.FC<NewCardFormProps> = ({ onSubmit, onCancel }) => {
  const [codename, setCodename] = useState('');
  const [staffingTime, setStaffingTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codename.trim() || !staffingTime.trim()) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit(codename.trim(), staffingTime.trim());
    setCodename('');
    setStaffingTime('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg border border-gray-700 p-6 w-96 shadow-2xl">
        <h2 className="text-white font-bold text-lg mb-4">Create New Staffing</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Codename */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Task Codename *
            </label>
            <input
              autoFocus
              type="text"
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              placeholder="e.g. Project Falcon, Deck Update"
              className="w-full bg-slate-700 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-sm"
              maxLength={50}
            />
            <p className="text-gray-500 text-xs mt-1">{codename.length}/50</p>
          </div>

          {/* Staffing Time */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
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
              className="w-full bg-slate-700 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-sm font-mono"
            />
            <p className="text-gray-500 text-xs mt-1">Format: HH:MM</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
            >
              Create Staffing
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
