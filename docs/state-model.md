# Modèle d'état

Les types sont définis dans `shared/src/types/game.ts`.

## État serveur (`GameState`)

Détenu en mémoire par `GameSession`. Contient l'information complète :

- `players` : joueurs, chacun avec sa grille (`board.cells`, 12 cellules), son total et son
  score de manche ;
- `deck` / `discard` : pioche et défausse (carte du dessus = dernier élément) ;
- `currentPlayerIndex`, `phase`, `turnPhase` ;
- `drawnCard` : carte en main en attente de placement ;
- `roundEnderId`, `pendingFinalTurns` : suivi de la fin de manche ;
- `round`, `winnerId`.

## Phases

- `phase` : `initialReveal` → `playing` → `lastRound` → `roundOver` (→ manche suivante) →
  `gameOver`.
- `turnPhase` : `chooseSource` → (`resolveDraw` | `resolveTake`) → (placement) ;
  `resolveDraw` peut mener à `flip`.

## Vue publique (`PublicGameState`)

Envoyée à chaque client par `toPublicState(state, viewerId)` :

- les cartes **face cachée** masquent leur valeur pour **tout le monde** ;
- `drawnCard` n'est visible que par le **joueur actif** ;
- expose `discardTop` et `deckCount` plutôt que les piles complètes.

Le client ne reçoit donc jamais d'information cachée d'un adversaire.
