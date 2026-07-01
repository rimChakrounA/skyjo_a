const NAME_KEY = 'skyjo.playerName';
const GUEST_READY_KEY = 'skyjo.guestReady';
const SESSION_KEY = 'skyjo.session';
const SESSION_CHANGED = 'skyjo:session-changed';

type SessionListener = () => void;
const sessionListeners = new Set<SessionListener>();

function notifySessionChanged(): void {
  sessionListeners.forEach((listener) => listener());
}

/** Abonnement aux changements de session (save / clear). */
export function subscribeSessionChange(listener: SessionListener): () => void {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

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

/** Indique si l'invité a validé son pseudo (écran dashboard). */
export function loadGuestReady(): boolean {
  try {
    return localStorage.getItem(GUEST_READY_KEY) === 'true';
  } catch {
    return false;
  }
}

/** Persiste l'état invité validé. */
export function saveGuestReady(ready: boolean): void {
  try {
    if (ready) {
      localStorage.setItem(GUEST_READY_KEY, 'true');
    } else {
      localStorage.removeItem(GUEST_READY_KEY);
    }
  } catch {
    // Stockage indisponible : on ignore silencieusement.
  }
}

/** Réinitialise la session invité (pseudo + état dashboard). */
export function clearGuestSession(): void {
  saveGuestReady(false);
  try {
    localStorage.removeItem(NAME_KEY);
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
    notifySessionChanged();
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
    notifySessionChanged();
  } catch {
    // Stockage indisponible : on ignore silencieusement.
  }
}
