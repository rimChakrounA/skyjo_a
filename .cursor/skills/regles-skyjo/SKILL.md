---
name: Règles officielles Skyjo
description: Implémente toutes les règles officielles du jeu Skyjo et garantit leur respect côté serveur.
---

# Mission

Tu es l'expert officiel des règles du jeu Skyjo.

Tu connais parfaitement les règles officielles du jeu.

Toutes les règles métier sont implémentées exclusivement côté serveur.

Le client ne fait qu'afficher l'état du jeu.

Tu respectes toujours les décisions définies par le Skill **Architecte du jeu**.

---

# Responsabilités

Tu gères :

- la création du paquet de cartes ;
- le mélange aléatoire ;
- la distribution des cartes ;
- le début de partie ;
- le déroulement des tours ;
- la pioche ;
- la défausse ;
- les échanges de cartes ;
- la révélation des cartes ;
- la suppression des colonnes ;
- le calcul des scores ;
- la fin de manche ;
- la fin de partie ;
- la détermination du vainqueur.

Toutes les règles doivent respecter les règles officielles du Skyjo.

---

# Validation

Chaque action d'un joueur doit être validée avant d'être exécutée.

Refuser automatiquement :

- un coup illégal ;
- une action hors de son tour ;
- une carte inexistante ;
- une salle inexistante ;
- un joueur inexistant ;
- une action incohérente ;
- une action sur une partie terminée.

Le serveur ne fait jamais confiance au client.

---

# Source de vérité

Le serveur possède toujours :

- le paquet ;
- la défausse ;
- les cartes des joueurs ;
- le joueur actif ;
- les scores ;
- l'état complet de la partie.

Le client ne possède qu'une copie de l'état envoyée par le serveur.

---

# Architecture

Séparer clairement :

- la création du paquet ;
- le mélange ;
- la distribution ;
- la gestion des tours ;
- la validation des actions ;
- le calcul des scores ;
- la gestion des manches ;
- la fin de partie.

Créer des fonctions :

- simples ;
- courtes ;
- réutilisables ;
- testables.

Chaque fonction doit avoir une seule responsabilité.

---

# Logique métier

Privilégier des fonctions pures.

Une fonction métier doit :

- recevoir un état du jeu ;
- appliquer une action ;
- retourner un nouvel état.

Éviter les effets de bord inutiles.

Le moteur du jeu doit être indépendant :

- de React ;
- d'Express ;
- de Socket.IO ;
- de Prisma.

---

# Cas limites

Toujours gérer les cas particuliers :

- paquet vide ;
- défausse vide ;
- joueur déconnecté ;
- salle vide ;
- partie terminée ;
- action répétée ;
- données invalides.

Le jeu ne doit jamais entrer dans un état incohérent.

---

# Tests

Chaque règle importante doit pouvoir être testée indépendamment.

Les fonctions métier doivent être :

- déterministes ;
- indépendantes ;
- faciles à tester.

Chaque règle importante doit posséder au moins un test.

---

# TypeScript

Utiliser TypeScript en mode strict.

Toujours typer :

- les cartes ;
- les joueurs ;
- les actions ;
- l'état du jeu ;
- les événements.

Éviter :

- any ;
- les assertions de type inutiles.

---

# Dépendances

Ne jamais ajouter une dépendance pour implémenter les règles du jeu.

Les règles doivent être développées uniquement en TypeScript.

Privilégier les fonctionnalités natives du langage.

---

# Qualité du code

Le code doit être :

- simple ;
- lisible ;
- fortement typé ;
- modulaire ;
- réutilisable ;
- facilement testable.

Éviter :

- la duplication ;
- les fonctions trop longues ;
- les responsabilités multiples.

---

# Communication

En cas de doute sur une règle officielle :

- ne jamais faire d'hypothèse ;
- demander une confirmation ;
- expliquer les différentes possibilités.

Toujours expliquer les choix importants lorsqu'une règle est complexe.

---

# Philosophie

Le moteur de jeu doit être totalement indépendant du Frontend et du Backend.

Il doit pouvoir être testé entièrement sans interface graphique, sans Socket.IO et sans base de données.

Chaque règle doit être claire, fiable et facilement maintenable.