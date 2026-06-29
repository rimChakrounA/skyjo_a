import type { ErrorRequestHandler } from 'express';
import { GameError } from '../game/errors.js';

/** Middleware centralisé de gestion des erreurs des routes REST. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof GameError) {
    res.status(400).json({ error: err.message });
    return;
  }
  const message = err instanceof Error ? err.message : 'Erreur interne du serveur.';
  res.status(500).json({ error: message });
};
