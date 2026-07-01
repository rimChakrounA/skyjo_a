import { INITIAL_REVEAL_COUNT } from '@shared/constants/game.js';
import type { GameAction } from '@shared/types/actions.js';
import type { PublicGameState, PublicPlayer } from '@shared/types/game.js';
import { useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSocket } from '@/hooks/useSocket';
import { sendAction, startGame } from '@/services/socket';

export interface UseGameResult {
  gameState: PublicGameState | null;
  error: string | null;
  selfId: string | null;
  isMyTurn: boolean;
  canDraw: boolean;
  canTake: boolean;
  canDiscardDrawn: boolean;
  canClickCard: (targetPlayerId: string, index: number) => boolean;
  isPlayerActive: (playerId: string) => boolean;
  onCardClick: (targetPlayerId: string, index: number) => void;
  draw: () => void;
  takeDiscard: () => void;
  discardDrawn: () => void;
  nextRound: () => void;
}

function countFaceUp(player: PublicPlayer): number {
  return player.cells.filter((cell) => cell !== null && cell.faceUp).length;
}

export function useGame(): UseGameResult {
  const { selfId } = useSocket();
  const { gameState, error } = useGameState();

  const self = gameState?.players.find((player) => player.id === selfId) ?? null;
  const isMyTurn = gameState !== null && selfId !== null && gameState.currentPlayerId === selfId;

  const inPlay = gameState?.phase === 'playing' || gameState?.phase === 'lastRound';
  const canDraw = Boolean(isMyTurn && inPlay && gameState?.turnPhase === 'chooseSource');
  const canTake = Boolean(
    isMyTurn &&
      inPlay &&
      gameState?.turnPhase === 'chooseSource' &&
      gameState?.discardTop !== null,
  );
  const canDiscardDrawn = Boolean(isMyTurn && inPlay && gameState?.turnPhase === 'resolveDraw');

  const isPlayerActive = useCallback(
    (playerId: string): boolean => {
      if (gameState === null) {
        return false;
      }
      if (gameState.phase === 'initialReveal') {
        const player = gameState.players.find((entry) => entry.id === playerId);
        if (player === undefined) {
          return false;
        }
        return countFaceUp(player) < INITIAL_REVEAL_COUNT;
      }
      if (gameState.phase === 'playing' || gameState.phase === 'lastRound') {
        return gameState.currentPlayerId === playerId;
      }
      return false;
    },
    [gameState],
  );

  const dispatch = useCallback((action: GameAction): void => {
    void sendAction(action);
  }, []);

  const canClickCard = useCallback(
    (targetPlayerId: string, index: number): boolean => {
      if (gameState === null || self === null || selfId === null || targetPlayerId !== selfId) {
        return false;
      }
      const cell = self.cells[index];
      if (cell === null || cell === undefined) {
        return false;
      }
      if (gameState.phase === 'initialReveal') {
        return !cell.faceUp && countFaceUp(self) < INITIAL_REVEAL_COUNT;
      }
      if (!isMyTurn) {
        return false;
      }
      if (gameState.turnPhase === 'resolveDraw' || gameState.turnPhase === 'resolveTake') {
        return true;
      }
      if (gameState.turnPhase === 'flip') {
        return !cell.faceUp;
      }
      return false;
    },
    [gameState, self, selfId, isMyTurn],
  );

  const onCardClick = useCallback(
    (targetPlayerId: string, index: number): void => {
      if (!canClickCard(targetPlayerId, index) || gameState === null) {
        return;
      }
      if (gameState.phase === 'initialReveal') {
        dispatch({ type: 'REVEAL_INITIAL', cardIndex: index });
      } else if (
        gameState.turnPhase === 'resolveDraw' ||
        gameState.turnPhase === 'resolveTake'
      ) {
        dispatch({ type: 'REPLACE_CARD', cardIndex: index });
      } else if (gameState.turnPhase === 'flip') {
        dispatch({ type: 'FLIP_CARD', cardIndex: index });
      }
    },
    [canClickCard, gameState, dispatch],
  );

  const draw = useCallback(() => {
    if (canDraw) dispatch({ type: 'DRAW_FROM_PILE' });
  }, [canDraw, dispatch]);

  const takeDiscard = useCallback(() => {
    if (canTake) dispatch({ type: 'TAKE_FROM_DISCARD' });
  }, [canTake, dispatch]);

  const discardDrawn = useCallback(() => {
    if (canDiscardDrawn) dispatch({ type: 'DISCARD_DRAWN' });
  }, [canDiscardDrawn, dispatch]);

  const nextRound = useCallback(() => {
    void startGame();
  }, []);

  return {
    gameState,
    error,
    selfId,
    isMyTurn,
    canDraw,
    canTake,
    canDiscardDrawn,
    canClickCard,
    isPlayerActive,
    onCardClick,
    draw,
    takeDiscard,
    discardDrawn,
    nextRound,
  };
}
