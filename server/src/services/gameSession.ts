import type { GameAction } from '@shared/types/actions.js';
import type { GamePhase, GameState, PublicGameState } from '@shared/types/game.js';
import {
  applyAction,
  createGame,
  skipDisconnectedTurn,
  startNextRound,
  toPublicState,
} from '../game/index.js';
import { defaultRng, type Rng } from '../game/rng.js';
import type { NewPlayer } from '../game/game.js';

/**
 * Encapsule l'état d'une partie pour une salle.
 * L'état reste en mémoire (jamais persisté) et n'est modifié que par le moteur de jeu.
 */
export class GameSession {
  private state: GameState;
  private readonly rng: Rng;

  constructor(players: readonly NewPlayer[], rng: Rng = defaultRng) {
    this.rng = rng;
    this.state = createGame(players, rng);
  }

  /** État complet (usage serveur uniquement). */
  getState(): GameState {
    return this.state;
  }

  get phase(): GamePhase {
    return this.state.phase;
  }

  /** Applique une action de joueur (lève une `GameError` si invalide). */
  dispatch(playerId: string, action: GameAction): void {
    this.state = applyAction(this.state, playerId, action, this.rng);
  }

  /** Démarre la manche suivante (valide après une fin de manche). */
  nextRound(): void {
    this.state = startNextRound(this.state, this.rng);
  }

  /** Met à jour l'état de connexion d'un joueur dans la partie. */
  setPlayerConnected(playerId: string, connected: boolean): void {
    this.state = {
      ...this.state,
      players: this.state.players.map((player) =>
        player.id === playerId ? { ...player, connected } : player,
      ),
    };
  }

  /** Passe le tour si le joueur courant est déconnecté (évite tout blocage). */
  skipTurnIfCurrentDisconnected(): void {
    this.state = skipDisconnectedTurn(this.state);
  }

  /** Identifiant du joueur dont c'est le tour, ou `null`. */
  currentPlayerId(): string | null {
    return this.state.players[this.state.currentPlayerIndex]?.id ?? null;
  }

  /** Nombre de joueurs encore connectés. */
  connectedCount(): number {
    return this.state.players.filter((player) => player.connected).length;
  }

  /** Vue publique filtrée pour un joueur donné. */
  publicStateFor(viewerId: string): PublicGameState {
    return toPublicState(this.state, viewerId);
  }

  /** Classement final, disponible uniquement lorsque la partie est terminée. */
  getStandings(): {
    winnerId: string;
    winnerName: string;
    rounds: number;
    players: { playerId: string; name: string; score: number }[];
  } | null {
    if (this.state.phase !== 'gameOver') {
      return null;
    }
    const winner = this.state.players.find((player) => player.id === this.state.winnerId);
    return {
      winnerId: this.state.winnerId ?? '',
      winnerName: winner?.name ?? '',
      rounds: this.state.round,
      players: this.state.players.map((player) => ({
        playerId: player.id,
        name: player.name,
        score: player.totalScore,
      })),
    };
  }
}
