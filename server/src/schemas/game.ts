import type { GameAction } from '@shared/types/actions.js';
import { z } from 'zod';

const cardIndex = z.number().int().min(0).max(11);

/** Schéma de validation de l'union des actions de jeu. */
export const gameActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('REVEAL_INITIAL'), cardIndex }),
  z.object({ type: z.literal('DRAW_FROM_PILE') }),
  z.object({ type: z.literal('TAKE_FROM_DISCARD') }),
  z.object({ type: z.literal('REPLACE_CARD'), cardIndex }),
  z.object({ type: z.literal('DISCARD_DRAWN') }),
  z.object({ type: z.literal('FLIP_CARD'), cardIndex }),
]) satisfies z.ZodType<GameAction>;

export const gameActionPayloadSchema = z.object({
  action: gameActionSchema,
});
