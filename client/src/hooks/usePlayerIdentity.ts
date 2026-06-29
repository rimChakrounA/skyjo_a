import { useCallback, useState } from 'react';
import { loadPlayerName, savePlayerName } from '@/services/identity';

export interface PlayerIdentity {
  name: string;
  setName: (name: string) => void;
}

/** Gère le pseudo du joueur, persisté dans le localStorage. */
export function usePlayerIdentity(): PlayerIdentity {
  const [name, setNameState] = useState<string>(() => loadPlayerName());

  const setName = useCallback((next: string) => {
    setNameState(next);
    savePlayerName(next);
  }, []);

  return { name, setName };
}
