import { useEffect } from 'react';

export const useScreenWakeLock = () => {
  useEffect(() => {
    let wakeLock: WakelockSentinel | null = null;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
          console.log('Screen Wake Lock ativado');
        }
      } catch (err) {
        console.log('Screen Wake Lock não disponível:', err);
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && wakeLock === null) {
        await requestWakeLock();
      }
    };

    // Solicitar wake lock ao montar
    requestWakeLock();

    // Reativar se a aba voltar ao foco
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock !== null) {
        wakeLock.release().catch(() => {});
      }
    };
  }, []);
};

// TypeScript types para WakeLock API
interface WakelockSentinel {
  release: () => Promise<void>;
}
