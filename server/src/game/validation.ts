import { INITIAL_REVEAL_COUNT } from '@shared/constants/game.js';
import type { GameAction } from '@shared/types/actions.js';
import type { GameState } from '@shared/types/game.js';
import { countFaceUp, isValidCellIndex } from './board.js';
import { GameError } from './errors.js';

/** Retrouve l'index d'un joueur ou lève une erreur si introuvable. */
function requirePlayerIndex(state: GameState, playerId: string): number {
  const index = state.players.findIndex((player) => player.id === playerId);
  if (index === -1) {
    throw new GameError('Joueur inexistant.');
  }
  return index;
}

function requireCellPresent(state: GameState, playerIndex: number, cardIndex: number): void {
  if (!isValidCellIndex(cardIndex)) {
    throw new GameError('Index de carte invalide.');
  }
  const cell = state.players[playerIndex]?.board.cells[cardIndex];
  if (cell === null || cell === undefined) {
    throw new GameError('Cette carte a déjà été retirée.');
  }
}

/**
 * Valide une action avant son exécution et renvoie l'index du joueur concerné.
 * Lève une `GameError` explicite pour toute action illégale.
 */
export function validateAction(state: GameState, playerId: string, action: GameAction): number {
  if (state.phase === 'gameOver' || state.phase === 'roundOver') {
    throw new GameError("La partie n'attend aucune action pour le moment.");
  }

  const playerIndex = requirePlayerIndex(state, playerId);

  if (action.type === 'REVEAL_INITIAL') {
    if (state.phase !== 'initialReveal') {
      throw new GameError('La révélation initiale est terminée.');
    }
    requireCellPresent(state, playerIndex, action.cardIndex);
    const cell = state.players[playerIndex]?.board.cells[action.cardIndex];
    if (cell?.faceUp) {
      throw new GameError('Cette carte est déjà révélée.');
    }
    if (countFaceUp(state.players[playerIndex]!.board) >= INITIAL_REVEAL_COUNT) {
      throw new GameError('Vous avez déjà révélé vos cartes initiales.');
    }
    return playerIndex;
  }

  if (state.phase !== 'playing' && state.phase !== 'lastRound') {
    throw new GameError('Aucune action de jeu autorisée pour le moment.');
  }

  if (playerIndex !== state.currentPlayerIndex) {
    throw new GameError("Ce n'est pas votre tour.");
  }

  switch (action.type) {
    case 'DRAW_FROM_PILE':
      if (state.turnPhase !== 'chooseSource') {
        throw new GameError('Vous ne pouvez pas piocher maintenant.');
      }
      break;
    case 'TAKE_FROM_DISCARD':
      if (state.turnPhase !== 'chooseSource') {
        throw new GameError('Vous ne pouvez pas prendre la défausse maintenant.');
      }
      if (state.discard.length === 0) {
        throw new GameError('La défausse est vide.');
      }
      break;
    case 'REPLACE_CARD':
      if (state.turnPhase !== 'resolveDraw' && state.turnPhase !== 'resolveTake') {
        throw new GameError("Aucune carte n'est en main à placer.");
      }
      requireCellPresent(state, playerIndex, action.cardIndex);
      break;
    case 'DISCARD_DRAWN':
      if (state.turnPhase !== 'resolveDraw') {
        throw new GameError('Vous ne pouvez pas défausser cette carte.');
      }
      break;
    case 'FLIP_CARD': {
      if (state.turnPhase !== 'flip') {
        throw new GameError('Vous ne pouvez pas révéler de carte maintenant.');
      }
      requireCellPresent(state, playerIndex, action.cardIndex);
      const cell = state.players[playerIndex]?.board.cells[action.cardIndex];
      if (cell?.faceUp) {
        throw new GameError('Cette carte est déjà révélée.');
      }
      break;
    }
  }

  return playerIndex;
}
