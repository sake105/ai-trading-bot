
import { useEffect } from 'react';

export function usePolling(callback: () => void | Promise<void>, ms: number) {
  useEffect(() => {
    let cancelled = false;

    async function tick() {
      if (cancelled) return;
      await callback();
    }

    const id = setInterval(() => {
      void tick();
    }, ms);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [callback, ms]);
}
