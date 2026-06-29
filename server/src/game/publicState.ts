import type {
  Board,
  GameState,
  PublicBoardCell,
  PublicGameState,
  PublicPlayer,
} from '@shared/types/game.js';

/** Convertit une grille en cellules publiques (les cartes cachées masquent leur valeur). */
function toPublicCells(board: Board): PublicBoardCell[] {
  return board.cells.map((cell) => {
    if (cell === null) {
      return null;
    }
    return cell.faceUp ? { faceUp: true, value: cell.value } : { faceUp: false };
  });
}

/**
 * Produit la vue publique de la partie pour un joueur donné.
 * La carte en main (`drawnCard`) n'est visible que par le joueur actif.
 */
export function toPublicState(state: GameState, viewerId: string): PublicGameState {
  const currentPlayer = state.players[state.currentPlayerIndex] ?? null;
  const isViewerCurrent = currentPlayer?.id === viewerId;

  const players: PublicPlayer[] = state.players.map((player) => ({
    id: player.id,
    name: player.name,
    connected: player.connected,
    cells: toPublicCells(player.board),
    totalScore: player.totalScore,
    roundScore: player.roundScore,
  }));

  return {
    players,
    currentPlayerId: currentPlayer?.id ?? null,
    phase: state.phase,
    turnPhase: state.turnPhase,
    discardTop: state.discard.length > 0 ? (state.discard[state.discard.length - 1] ?? null) : null,
    deckCount: state.deck.length,
    drawnCard: isViewerCurrent ? state.drawnCard : null,
    round: state.round,
    roundEnderId: state.roundEnderId,
    winnerId: state.winnerId,
  };
}
