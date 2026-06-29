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

## Déploiement en ligne

Le backend se déploie sur **Railway**, le frontend sur **Vercel**.

### 1 — Backend sur Railway

1. Crée un compte sur [railway.app](https://railway.app) et installe la CLI :
   ```bash
   npm install -g @railway/cli
   railway login
   ```
2. Depuis la racine du projet :
   ```bash
   railway init        # crée un nouveau projet
   railway up          # déploie
   ```
3. Dans le dashboard Railway → **Variables**, ajoute :

   | Variable | Valeur |
   | --- | --- |
   | `DATABASE_URL` | `file:./prod.db` |
   | `CLIENT_ORIGIN` | `https://ton-app.vercel.app` *(à remplir après l'étape Vercel)* |

4. Note l'URL publique générée (ex : `https://skyjo-online.up.railway.app`).

### 2 — Frontend sur Vercel

1. Crée un compte sur [vercel.com](https://vercel.com) et importe le dépôt GitHub.
2. Vercel détecte automatiquement `vercel.json`. Ajoute en **Environment Variables** :

   | Variable | Valeur |
   | --- | --- |
   | `VITE_SERVER_URL` | `https://skyjo-online.up.railway.app` *(URL Railway de l'étape 1)* |

3. Clique **Deploy** — le client sera accessible sur `https://ton-app.vercel.app`.

4. Retourne dans Railway et mets à jour `CLIENT_ORIGIN` avec l'URL Vercel.

> **Note** : La base SQLite est stockée dans le conteneur Railway. Les parties terminées
> sont effacées à chaque redéploiement. Le gameplay (en mémoire) n'est pas affecté.

---

## Roadmap

- **V1** ✅ Créer/rejoindre une salle · Lobby · Partie complète · Scores · Fin de partie
- **V2** 🔜 Authentification · Historique · Statistiques · Invitations
- **V3** 🔜 Classement · Parties privées · Spectateurs · Reconnexion · Chat
