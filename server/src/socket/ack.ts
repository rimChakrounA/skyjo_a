import type { AckResponse } from '@shared/types/socket.js';

export function ok<T>(data: T): AckResponse<T> {
  return { ok: true, data };
}

export function fail(error: string): AckResponse<never> {
  return { ok: false, error };
}

export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Erreur inattendue.';
}
