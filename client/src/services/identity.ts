const NAME_KEY = 'skyjo.playerName';

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
    // Stockage indisponible : on ignore silencieusement (pas de logique métier ici).
  }
}
