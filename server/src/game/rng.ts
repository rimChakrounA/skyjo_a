/**
 * Générateur de nombres aléatoires injectable.
 * Permet des tests déterministes en fournissant une graine.
 */

/** Fonction renvoyant un nombre dans l'intervalle [0, 1). */
export type Rng = () => number;

/** RNG par défaut basé sur Math.random. */
export const defaultRng: Rng = Math.random;

/**
 * Crée un RNG déterministe (mulberry32) à partir d'une graine entière.
 * Utilisé exclusivement pour rendre les tests reproductibles.
 */
export function createSeededRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
