# Skyjo Online

Version multijoueur en ligne du jeu de cartes Skyjo, jouable dans le navigateur.

**Stack** : React · TypeScript · Vite · Node.js · Express · Socket.IO · Prisma · SQLite

---

## Jouer en local

### Prérequis

- [Node.js](https://nodejs.org) >= 20
- npm >= 10

### Installation

```bash
git clone https://github.com/VOTRE_COMPTE/skyjo-online.git
cd skyjo-online
npm install
```

### Base de données

```bash
cd server
npx prisma migrate dev
cd ..
```

### Lancement

```bash
npm run dev
```

- Client : http://localhost:5173
- Serveur : http://localhost:3001

### Tester avec plusieurs joueurs

Ouvre **plusieurs onglets** (ou plusieurs navigateurs) sur http://localhost:5173 :

1. **Joueur 1** — saisir un pseudo → **Créer une salle**
2. **Joueur 2** — saisir un pseudo → entrer le code → **Rejoindre**
3. Le joueur 1 (hôte) clique **Démarrer la partie**

---

## Scripts

| Commande            | Description                                |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Lance serveur + client en parallèle        |
| `npm test`          | Tous les tests (65 tests)                  |
| `npm run typecheck` | Vérification TypeScript                    |
| `npm run lint`      | Analyse ESLint                             |
| `npm run build`     | Build de production                        |

---

## Architecture

```
client/   Interface React — affichage uniquement
server/   Express + Socket.IO + moteur de jeu — source de vérité
shared/   Types et constantes partagés
docs/     Documentation technique
```

Voir [docs/architecture.md](./docs/architecture.md) pour le détail.

---

## Roadmap

- **V1** ✅ Créer/rejoindre une salle · Lobby · Partie complète · Scores · Fin de partie
- **V2** 🔜 Authentification · Historique · Statistiques · Invitations
- **V3** 🔜 Classement · Parties privées · Spectateurs · Reconnexion · Chat
