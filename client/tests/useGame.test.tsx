import type { PublicGameState, PublicPlayer } from '@shared/types/game.js';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { GameStateContext } from '@/contexts/GameStateContext';
import { SocketContext, type SocketContextValue } from '@/contexts/SocketContext';
import { useGame } from '@/hooks/useGame';

function makePlayer(id: string, faceUpCount = 0): PublicPlayer {
  const cells = Array.from({ length: 12 }, (_, index) =>
    index < faceUpCount ? ({ faceUp: true, value: 3 } as const) : ({ faceUp: false } as const),
  );
  return { id, name: id, connected: true, cells, totalScore: 0, roundScore: null };
}

function makeState(overrides: Partial<PublicGameState> = {}): PublicGameState {
  return {
    phase: 'initialReveal',
    round: 1,
    currentPlayerId: 'p1',
    turnPhase: null,
    discardTop: 10,
    deckCount: 100,
    drawnCard: null,
    roundEnderId: null,
    winnerId: null,
    players: [makePlayer('p1'), makePlayer('p2')],
    ...overrides,
  };
}

function wrapper(selfId: string | null, gameState: PublicGameState | null) {
  const socketValue = {
    socket: {} as SocketContextValue['socket'],
    connected: true,
    socketId: selfId,
    playerId: selfId,
    selfId,
    reconnecting: false,
    reconnectedRoom: null,
    clearReconnectedRoom: vi.fn(),
  } satisfies SocketContextValue;

  const gameValue = {
    gameState,
    roomSummary: null,
    error: null,
    closedReason: null,
    rematchRoomCode: null,
    clearRematchRoomCode: vi.fn(),
    clearError: vi.fn(),
    reset: vi.fn(),
  };

  return ({ children }: { children: ReactNode }) => (
    <SocketContext.Provider value={socketValue}>
      <GameStateContext.Provider value={gameValue}>{children}</GameStateContext.Provider>
    </SocketContext.Provider>
  );
}

describe('useGame', () => {
  it('autorise la révélation initiale avec selfId via socketId', () => {
    const state = makeState();
    const { result } = renderHook(() => useGame(), { wrapper: wrapper('p1', state) });

    expect(result.current.selfId).toBe('p1');
    expect(result.current.canClickCard('p1', 2)).toBe(true);
    expect(result.current.canClickCard('p2', 2)).toBe(false);
  });

  it('bloque les actions si selfId ne correspond à aucun joueur', () => {
    const state = makeState();
    const { result } = renderHook(() => useGame(), { wrapper: wrapper('unknown', state) });

    expect(result.current.canClickCard('unknown', 0)).toBe(false);
    expect(result.current.canDraw).toBe(false);
  });

  it('autorise piocher au bon tour', () => {
    const state = makeState({
      phase: 'playing',
      turnPhase: 'chooseSource',
      currentPlayerId: 'p1',
    });
    const { result } = renderHook(() => useGame(), { wrapper: wrapper('p1', state) });

    expect(result.current.canDraw).toBe(true);
    expect(result.current.canTake).toBe(true);
  });

  it('autorise de défausser la carte piochée', () => {
    const state = makeState({
      phase: 'playing',
      turnPhase: 'resolveDraw',
      currentPlayerId: 'p1',
      drawnCard: 7,
    });
    const { result } = renderHook(() => useGame(), { wrapper: wrapper('p1', state) });

    expect(result.current.canDiscardDrawn).toBe(true);
  });

  it('marque actifs les joueurs n’ayant pas fini la révélation initiale', () => {
    const state = makeState({
      phase: 'initialReveal',
      players: [makePlayer('p1', 2), makePlayer('p2', 0)],
    });
    const { result } = renderHook(() => useGame(), { wrapper: wrapper('p1', state) });

    expect(result.current.isPlayerActive('p1')).toBe(false);
    expect(result.current.isPlayerActive('p2')).toBe(true);
  });

  it('marque actif uniquement le joueur courant en phase de jeu', () => {
    const state = makeState({
      phase: 'playing',
      turnPhase: 'chooseSource',
      currentPlayerId: 'p2',
    });
    const { result } = renderHook(() => useGame(), { wrapper: wrapper('p1', state) });

    expect(result.current.isPlayerActive('p1')).toBe(false);
    expect(result.current.isPlayerActive('p2')).toBe(true);
  });
});
