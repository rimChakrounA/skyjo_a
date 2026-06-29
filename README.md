# Skyjo Online

Version multijoueur en ligne du jeu de cartes Skyjo. Le projet est organisé en monorepo (npm workspaces) :

```
client/   Interface React (affichage uniquement)
server/   API Express + Socket.IO + moteur de jeu (source de vérité)
shared/   Types, interfaces et constantes partagés (aucune logique métier)
docs/     Documentation du projet
```

## Prérequis

- Node.js >= 20
- npm >= 10

## Installation

```bash
npm install
```

## Scripts

| Commande            | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Lance le serveur et le client en parallèle           |
| `npm run dev:server`| Lance uniquement le serveur (port 3001)              |
| `npm run dev:client`| Lance uniquement le client (port 5173)               |
| `npm run build`     | Build de tous les workspaces                          |
| `npm test`          | Exécute tous les tests (Vitest)                      |
| `npm run typecheck` | Vérifie les types de tous les workspaces             |
| `npm run lint`      | Analyse le code avec ESLint                          |
| `npm run format`    | Formate le code avec Prettier                        |

## Documentation

- [Architecture](./docs/architecture.md)
- [Règles du jeu](./docs/game-rules.md)
- [Modèle d'état](./docs/state-model.md)
- [Contrat Socket.IO](./docs/socket-events.md)
- [API REST](./docs/api.md)
- [Développement](./docs/development.md)
- [Tests](./docs/testing.md)
