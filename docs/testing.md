# Tests

Le projet utilise **Vitest**. Lancer l'ensemble depuis la racine :

```bash
npm test
```

## Organisation

- **Serveur** (`server/tests`, environnement Node) :
  - moteur de jeu : paquet, distribution, tours, colonnes, validation, scores, fin de partie ;
  - services : salles, sessions de partie ;
  - Socket.IO : création/jonction de salle, démarrage, déconnexions ;
  - REST : health, parties terminées ;
  - intégration : une partie complète jouée jusqu'au vainqueur.
- **Client** (`client/tests`, environnement jsdom) :
  - composants clés (`JoinForm`, `Board`, `Scoreboard`).

## Principes

- Les tests sont rapides, indépendants et déterministes.
- Le moteur de jeu utilise un RNG injectable (`createSeededRng`) pour des résultats
  reproductibles.
- Structure Arrange / Act / Assert, un comportement vérifié par test.
