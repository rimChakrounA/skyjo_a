import { useContext } from 'react';
import { GameStateContext, type GameStateContextValue } from '@/contexts/GameStateContext';

/** Accès au contexte d'état de jeu. Lève une erreur hors du `GameStateProvider`. */
export function useGameState(): GameStateContextValue {
  const context = useContext(GameStateContext);
  if (context === null) {
    throw new Error('useGameState doit être utilisé à l’intérieur d’un GameStateProvider.');
  }
  return context;
}
