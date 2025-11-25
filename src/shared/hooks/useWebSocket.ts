
import { useEffect } from 'react';

interface WebSocketHandlers {
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (err: Event) => void;
}

export function useWebSocket(
  url: string | null,
  handlers: WebSocketHandlers = {},
) {
  const { onMessage, onOpen, onClose, onError } = handlers;

  useEffect(() => {
    if (!url || typeof window === 'undefined') return;
    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(url);
    } catch (e) {
      console.error('WebSocket connection error', e);
      onError?.(e as any);
      return;
    }

    ws.onopen = () => {
      onOpen?.();
    };

    ws.onclose = () => {
      onClose?.();
    };

    ws.onerror = (err) => {
      onError?.(err);
    };

    ws.onmessage = (event) => {
      let data: any = event.data;
      try {
        data = JSON.parse(event.data as string);
      } catch {
        // Ignore, pass original string
      }
      onMessage?.(data);
    };

    return () => {
      ws?.close();
    };
  }, [url, onMessage, onOpen, onClose, onError]);
}
