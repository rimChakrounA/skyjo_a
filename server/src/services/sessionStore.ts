import { randomUUID } from 'node:crypto';

export interface SessionEntry {
  roomCode: string;
  playerId: string;
  playerName: string;
  /** Identifiant du compte utilisateur authentifié (null pour les invités). */
  userId: string | null;
  /** Timestamp d'expiration en ms (null si le joueur est connecté). */
  expiresAt: number | null;
}

/** Durée de grâce avant expiration d'une session déconnectée (5 minutes). */
const TTL_MS = 5 * 60 * 1000;

/**
 * Stockage en mémoire des sessions de joueurs.
 * Permet la reconnexion transparente après une déconnexion involontaire.
 */
export class SessionStore {
  private readonly sessions = new Map<string, SessionEntry>();

  /** Crée une nouvelle session et renvoie son token unique. */
  create(roomCode: string, playerId: string, playerName: string, userId: string | null = null): string {
    const token = randomUUID();
    this.sessions.set(token, { roomCode, playerId, playerName, userId, expiresAt: null });
    return token;
  }

  /** Récupère une session valide, undefined si expirée ou inconnue. */
  get(token: string): SessionEntry | undefined {
    const entry = this.sessions.get(token);
    if (entry === undefined) {
      return undefined;
    }
    if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
      this.sessions.delete(token);
      return undefined;
    }
    return entry;
  }

  /** Démarre le compte à rebours d'expiration (à appeler lors d'une déconnexion). */
  startExpiry(token: string): void {
    const entry = this.sessions.get(token);
    if (entry !== undefined) {
      entry.expiresAt = Date.now() + TTL_MS;
    }
  }

  /** Annule l'expiration (joueur reconnecté). */
  cancelExpiry(token: string): void {
    const entry = this.sessions.get(token);
    if (entry !== undefined) {
      entry.expiresAt = null;
    }
  }

  /** Supprime définitivement une session (départ volontaire). */
  delete(token: string): void {
    this.sessions.delete(token);
  }

  /** Trouve le token d'un joueur dans une salle donnée. */
  findByPlayer(roomCode: string, playerId: string): string | undefined {
    for (const [token, entry] of this.sessions) {
      if (entry.roomCode === roomCode && entry.playerId === playerId) {
        return token;
      }
    }
    return undefined;
  }
}

export const sessionStore = new SessionStore();
