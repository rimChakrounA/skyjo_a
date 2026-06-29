# PROJECT.md

# Skyjo Online

## Présentation

Skyjo Online est une version multijoueur en ligne du célèbre jeu de cartes Skyjo.

L'objectif est de proposer une expérience moderne, fluide, performante et fidèle aux règles officielles du jeu.

Le projet est open source et hébergé sur GitHub.

---

# Objectifs

Construire une application :

- moderne ;
- performante ;
- simple ;
- facilement maintenable ;
- facilement évolutive ;
- agréable à utiliser.

Chaque décision technique doit privilégier la simplicité.

---

# Stack technique

## Frontend

- React
- TypeScript
- Vite

## Backend

- Node.js
- Express
- Socket.IO

## Base de données

- Prisma
- SQLite

## Tests

- Vitest

---

# Architecture du projet

Le projet est organisé en trois parties.

```
client/
server/
shared/
```

## Client

Le dossier `client` contient uniquement :

- l'interface utilisateur ;
- les composants React ;
- les pages ;
- les hooks ;
- les services ;
- les appels API ;
- la communication Socket.IO.

Le Frontend ne contient jamais de logique métier.

---

## Server

Le dossier `server` contient :

- les API REST ;
- Socket.IO ;
- le moteur du jeu ;
- la logique métier ;
- la validation ;
- Prisma ;
- SQLite.

Le serveur est toujours la source de vérité.

Toutes les règles du jeu sont implémentées côté serveur.

---

## Shared

Le dossier `shared` contient uniquement :

- les interfaces TypeScript ;
- les types ;
- les constantes communes ;
- les utilitaires réellement partagés.

Aucune logique métier ne doit être présente dans ce dossier.

---

# Architecture logicielle

Toujours respecter les principes suivants :

- simplicité ;
- lisibilité ;
- modularité ;
- faible couplage ;
- forte cohésion ;
- composants réutilisables ;
- une responsabilité par fonction ;
- une responsabilité par composant.

Éviter toute sur-ingénierie.

---

# TypeScript

Le projet utilise TypeScript en mode strict.

Toujours :

- typer les fonctions ;
- typer les paramètres ;
- typer les retours ;
- typer les props ;
- typer les états.

Éviter :

- any ;
- les assertions de type inutiles ;
- les types implicites.

---

# Dépendances

Avant d'ajouter une nouvelle dépendance :

- vérifier qu'elle est réellement nécessaire ;
- vérifier qu'une solution native n'existe pas ;
- vérifier qu'une dépendance existante ne couvre pas déjà le besoin ;
- vérifier qu'elle est activement maintenue ;
- vérifier qu'elle est largement utilisée ;
- vérifier qu'elle est compatible avec React, Node.js et TypeScript.

Ne jamais utiliser :

- une version alpha ;
- une version bêta ;
- une Release Candidate ;
- une bibliothèque abandonnée ;
- une bibliothèque peu maintenue.

Toujours expliquer pourquoi une dépendance est ajoutée.

Limiter le nombre de dépendances au strict nécessaire.

---

# Base de données

SQLite est utilisée uniquement pour stocker :

- les utilisateurs ;
- les parties terminées ;
- les statistiques ;
- les préférences.

Ne jamais enregistrer une partie en cours dans SQLite.

L'état d'une partie est conservé uniquement en mémoire.

---

# Moteur du jeu

Le moteur du jeu est totalement indépendant :

- de React ;
- d'Express ;
- de Socket.IO ;
- de Prisma.

Il doit pouvoir être testé sans interface graphique ni réseau.

Les règles du jeu doivent être implémentées sous forme de fonctions pures lorsque cela est possible.

---

# Communication

Le Frontend communique avec le Backend uniquement :

- via les API REST ;
- via Socket.IO.

Le Frontend ne décide jamais des règles du jeu.

Le Backend valide systématiquement toutes les actions.

---

# Qualité du code

Le code doit être :

- simple ;
- lisible ;
- modulaire ;
- fortement typé ;
- réutilisable ;
- facilement testable.

Éviter :

- le code dupliqué ;
- les fonctions trop longues ;
- les composants trop volumineux ;
- les dépendances circulaires.

Toujours privilégier une solution simple plutôt qu'une solution complexe.

---

# Tests

Toute logique métier importante doit être testée.

Les tests doivent être :

- rapides ;
- indépendants ;
- déterministes ;
- faciles à comprendre.

Les tests servent également de documentation du comportement attendu.

---

# Roadmap

## Version 1

- Création d'une salle
- Rejoindre une salle
- Lobby
- Distribution des cartes
- Déroulement d'une partie
- Calcul des scores
- Fin de partie

## Version 2

- Authentification
- Historique des parties
- Statistiques
- Rejouer une partie
- Invitations

## Version 3

- Classement
- Parties privées
- Spectateurs
- Reconnexion automatique
- Chat

---

# Philosophie du projet

Construire un projet professionnel, simple et évolutif.

Le code doit être compréhensible par un nouveau développeur en quelques minutes.

Chaque choix technique doit être justifié.

Privilégier la simplicité, la qualité et la maintenabilité avant l'optimisation.

Ne jamais complexifier le projet sans bénéfice réel.

L'objectif est de créer la meilleure version open source de Skyjo Online avec une architecture propre, un code de qualité et une excellente expérience utilisateur.