/** Erreur métier explicite levée par le moteur de jeu lorsqu'une action est invalide. */
export class GameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GameError';
  }
}
