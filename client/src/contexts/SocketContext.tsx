import type { RoomStatus } from '@shared/types/room.js';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { clearSession, loadSession } from '@/services/identity';
import { getSocket, restoreSession, type AppSocket } from '@/services/socket';

export interface ReconnectedRoom {
  code: string;
  status: RoomStatus;
}

export interface SocketContextValue {
  socket: AppSocket;
  connected: boolean;
  socketId: string | null;
  /** Identifiant logique du joueur, stable entre reconnexions. */
  playerId: string | null;
  /** Vrai pendant la tentative de restauration de session. */
  reconnecting: boolean;
  /** Salle restaurée : consommer pour naviguer puis appeler clearReconnectedRoom. */
  reconnectedRoom: ReconnectedRoom | null;
  clearReconnectedRoom: () => void;
}

export const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }): JSX.Element {
  const socket = useMemo(() => getSocket(), []);
  const [connected, setConnected] = useState<boolean>(socket.connected);
  const [socketId, setSocketId] = useState<string | null>(socket.id ?? null);
  const [reconnecting, setReconnecting] = useState<boolean>(false);
  const [reconnectedRoom, setReconnectedRoom] = useState<ReconnectedRoom | null>(null);

  // Identifiant logique : persisté entre reconnexions via le localStorage
  const [playerId, setPlayerId] = useState<string | null>(
    () => loadSession()?.playerId ?? null,
  );

  const clearReconnectedRoom = useCallback(() => setReconnectedRoom(null), []);

  useEffect(() => {
    const attemptRestore = async (): Promise<void> => {
      const session = loadSession();
      if (session === null) {
        setPlayerId(socket.id ?? null);
        return;
      }
      setReconnecting(true);
      const response = await restoreSession(session.sessionToken);
      setReconnecting(false);
      if (response.ok) {
        setPlayerId(response.data.playerId);
        setReconnectedRoom({
          code: response.data.room.code,
          status: response.data.room.status,
        });
      } else {
        clearSession();
        setPlayerId(socket.id ?? null);
      }
    };

    const onConnect = (): void => {
      setConnected(true);
      setSocketId(socket.id ?? null);
      void attemptRestore();
    };

    const onDisconnect = (): void => {
      setConnected(false);
      setSocketId(null);
      setReconnecting(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Si déjà connecté au montage (ex: hot reload), tenter la restauration immédiatement
    if (socket.connected) {
      void attemptRestore();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  const value = useMemo<SocketContextValue>(
    () => ({ socket, connected, socketId, playerId, reconnecting, reconnectedRoom, clearReconnectedRoom }),
    [socket, connected, socketId, playerId, reconnecting, reconnectedRoom, clearReconnectedRoom],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
