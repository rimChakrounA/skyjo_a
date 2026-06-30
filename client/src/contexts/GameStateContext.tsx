import type { PublicGameState } from '@shared/types/game.js';
import type { RoomSummary } from '@shared/types/room.js';
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { clearSession } from '@/services/identity';
import { useSocket } from '@/hooks/useSocket';

export interface GameStateContextValue {
  gameState: PublicGameState | null;
  roomSummary: RoomSummary | null;
  error: string | null;
  closedReason: string | null;
  /** Code de salle de la revanche reçue du serveur (à consommer pour naviguer). */
  rematchRoomCode: string | null;
  clearRematchRoomCode: () => void;
  clearError: () => void;
  reset: () => void;
}

export const GameStateContext = createContext<GameStateContextValue | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }): JSX.Element {
  const { socket } = useSocket();
  const [gameState, setGameState] = useState<PublicGameState | null>(null);
  const [roomSummary, setRoomSummary] = useState<RoomSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [closedReason, setClosedReason] = useState<string | null>(null);
  const [rematchRoomCode, setRematchRoomCode] = useState<string | null>(null);

  useEffect(() => {
    const onState = (state: PublicGameState): void => {
      setGameState(state);
    };
    const onRoom = (summary: RoomSummary): void => {
      setRoomSummary(summary);
    };
    const onError = (data: { message: string }): void => {
      setError(data.message);
    };
    const onClosed = (data: { reason: string }): void => {
      clearSession();
      setClosedReason(data.reason);
      setGameState(null);
    };
    const onRematch = (room: RoomSummary): void => {
      setGameState(null);
      setRoomSummary(room);
      setRematchRoomCode(room.code);
    };

    socket.on('game:state', onState);
    socket.on('room:update', onRoom);
    socket.on('game:error', onError);
    socket.on('room:closed', onClosed);
    socket.on('game:rematch', onRematch);

    return () => {
      socket.off('game:state', onState);
      socket.off('room:update', onRoom);
      socket.off('game:error', onError);
      socket.off('room:closed', onClosed);
      socket.off('game:rematch', onRematch);
    };
  }, [socket]);

  const clearError = useCallback(() => setError(null), []);
  const clearRematchRoomCode = useCallback(() => setRematchRoomCode(null), []);
  const reset = useCallback(() => {
    setGameState(null);
    setRoomSummary(null);
    setError(null);
    setClosedReason(null);
    setRematchRoomCode(null);
  }, []);

  const value = useMemo<GameStateContextValue>(
    () => ({
      gameState,
      roomSummary,
      error,
      closedReason,
      rematchRoomCode,
      clearRematchRoomCode,
      clearError,
      reset,
    }),
    [gameState, roomSummary, error, closedReason, rematchRoomCode, clearRematchRoomCode, clearError, reset],
  );

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
}
