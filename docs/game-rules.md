# Règles du Skyjo (implémentation)

Cette page décrit les règles officielles telles qu'implémentées dans le moteur de jeu
(`server/src/game`). Toutes les règles sont validées côté serveur.

## Paquet

150 cartes : valeurs de -2 à 12.

| Valeur | Nombre |
| ------ | ------ |
| -2     | 5      |
| -1     | 10     |
| 0      | 15     |
| 1 à 12 | 10 chacune |

## Mise en place d'une manche

1. Chaque joueur reçoit 12 cartes disposées en grille 3 × 4, face cachée.
2. Une carte de la pioche est retournée pour former la défausse.
3. Chaque joueur révèle 2 cartes.
4. Le joueur dont la somme des deux cartes révélées est la plus haute commence
   (en cas d'égalité, le premier joueur dans l'ordre).

## Déroulement d'un tour

À son tour, le joueur :

- **pioche** la carte du dessus de la pioche, puis :
  - la place sur sa grille en remplaçant une carte (la carte remplacée est défaussée), ou
  - la défausse, puis révèle une de ses cartes cachées ;
- ou **prend** la carte du dessus de la défausse, qu'il **doit** placer sur sa grille.

## Suppression de colonne

Lorsqu'une colonne (3 cartes) contient trois cartes révélées de valeur identique, la
colonne entière est retirée et défaussée.

## Fin de manche

Dès qu'un joueur a révélé ou retiré toutes ses cartes, chaque autre joueur joue un
dernier tour. Toutes les cartes sont ensuite révélées et comptabilisées.

## Score

- Le score d'une manche est la somme des valeurs des cartes restantes.
- Si le joueur ayant clôturé la manche n'a pas le plus petit score (à lui seul) et que son
  score est strictement positif, son score de manche est **doublé**.

## Fin de partie

La partie s'arrête à la fin de la manche au cours de laquelle un joueur atteint **100
points ou plus**. Le joueur avec le **plus petit total** remporte la partie.
