import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getSocket, type AppSocket } from '@/services/socket';

export interface SocketContextValue {
  socket: AppSocket;
  connected: boolean;
  /** Identifiant du joueur courant (égal à l'id du socket), `null` tant que non connecté. */
  socketId: string | null;
}

export const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }): JSX.Element {
  const socket = useMemo(() => getSocket(), []);
  const [connected, setConnected] = useState<boolean>(socket.connected);
  const [socketId, setSocketId] = useState<string | null>(socket.id ?? null);

  useEffect(() => {
    const onConnect = (): void => {
      setConnected(true);
      setSocketId(socket.id ?? null);
    };
    const onDisconnect = (): void => {
      setConnected(false);
      setSocketId(null);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  const value = useMemo<SocketContextValue>(
    () => ({ socket, connected, socketId }),
    [socket, connected, socketId],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
