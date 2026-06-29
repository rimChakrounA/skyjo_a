# Développement

## Prérequis

- Node.js >= 20
- npm >= 10

## Installation

```bash
npm install
```

## Base de données

Le serveur utilise SQLite via Prisma. Pour initialiser la base locale :

```bash
cd server
npx prisma migrate dev
```

Variables d'environnement (`server/.env`, voir `server/.env.example`) :

- `DATABASE_URL` (par défaut `file:./dev.db`)
- `PORT` (par défaut `3001`)
- `CLIENT_ORIGIN` (par défaut `http://localhost:5173`)

## Lancer en développement

```bash
npm run dev
```

- Serveur : http://localhost:3001
- Client : http://localhost:5173

On peut lancer chaque partie séparément : `npm run dev:server` / `npm run dev:client`.

Pour pointer le client vers un autre serveur, définir `VITE_SERVER_URL`.

## Scripts utiles

| Commande            | Description                          |
| ------------------- | ------------------------------------ |
| `npm run build`     | Build de tous les workspaces         |
| `npm test`          | Tous les tests (Vitest)              |
| `npm run typecheck` | Vérification des types               |
| `npm run lint`      | Analyse ESLint                       |
| `npm run format`    | Formatage Prettier                   |

## Structure

Voir [architecture.md](./architecture.md).
