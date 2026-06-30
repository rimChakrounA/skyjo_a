const NAME_KEY = 'skyjo.playerName';
const SESSION_KEY = 'skyjo.session';

/** Lit le pseudo enregistré localement. */
export function loadPlayerName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
}

/** Enregistre le pseudo localement. */
export function savePlayerName(name: string): void {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    // Stockage indisponible : on ignore silencieusement.
  }
}

/** Données de session stockées localement pour permettre la reconnexion. */
export interface StoredSession {
  sessionToken: string;
  roomCode: string;
  playerId: string;
}

/** Enregistre la session active. */
export function saveSession(session: StoredSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Stockage indisponible : on ignore silencieusement.
  }
}

/** Charge la session active, null si absente ou invalide. */
export function loadSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw === null) {
      return null;
    }
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

/** Supprime la session active (départ volontaire ou expiration). */
export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Stockage indisponible : on ignore silencieusement.
  }
}
