export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
};

export const getTaskColor = (elapsedSeconds: number): string => {
  if (elapsedSeconds < 30 * 60) return 'bg-green-status';
  if (elapsedSeconds < 90 * 60) return 'bg-yellow-status';
  if (elapsedSeconds < 180 * 60) return 'bg-orange-status';
  return 'bg-red-status';
};

export const getTaskColorBorder = (elapsedSeconds: number): string => {
  if (elapsedSeconds < 30 * 60) return 'border-green-status';
  if (elapsedSeconds < 90 * 60) return 'border-yellow-status';
  if (elapsedSeconds < 180 * 60) return 'border-orange-status';
  return 'border-red-status';
};

export const getTodayStartTime = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
};
