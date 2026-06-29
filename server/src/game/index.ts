/** API publique du moteur de jeu Skyjo (indépendant de tout framework). */
export { GameError } from './errors.js';
export { createDeck, shuffle } from './deck.js';
export { createSeededRng, defaultRng, type Rng } from './rng.js';
export {
  createGame,
  startNextRound,
  applyAction,
  finalizeTurn,
  skipDisconnectedTurn,
  type NewPlayer,
} from './game.js';
export { toPublicState } from './publicState.js';
export { validateAction } from './validation.js';
export { determineWinner, finalizeRound } from './scoring.js';
