import { useEffect } from 'react';

interface KeyboardShortcuts {
  onNewTask?: () => void;
  onToggleTimer?: () => void;
  onMoveColumn?: (columnIndex: number) => void;
}

export function useKeyboardShortcuts(callbacks: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focused on an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          callbacks.onNewTask?.();
          break;
        case ' ':
          e.preventDefault();
          callbacks.onToggleTimer?.();
          break;
        case '1':
          e.preventDefault();
          callbacks.onMoveColumn?.(0);
          break;
        case '2':
          e.preventDefault();
          callbacks.onMoveColumn?.(1);
          break;
        case '3':
          e.preventDefault();
          callbacks.onMoveColumn?.(2);
          break;
        case '4':
          e.preventDefault();
          callbacks.onMoveColumn?.(3);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
}
