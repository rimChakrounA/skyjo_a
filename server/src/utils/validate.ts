import type { ZodType } from 'zod';
import { GameError } from '../game/errors.js';

/**
 * Valide une charge utile à l'aide d'un schéma zod.
 * Lève une `GameError` explicite si les données sont invalides.
 */
export function parsePayload<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const first = result.error.issues[0];
    throw new GameError(first ? `Donnée invalide : ${first.message}` : 'Données invalides.');
  }
  return result.data;
}
