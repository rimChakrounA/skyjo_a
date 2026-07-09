# Contrat Socket.IO

Défini dans `shared/src/types/socket.ts`. L'identifiant d'un joueur est l'`id` de son
socket.

## Client → Serveur (avec accusé de réception)

Toutes les réponses suivent le format `AckResponse<T>` :
`{ ok: true, data: T }` ou `{ ok: false, error: string }`.

| Événement      | Charge utile                       | Réponse (`data`)        |
| -------------- | ---------------------------------- | ----------------------- |
| `room:create`  | `{ playerName }`                   | `{ room, playerId }`    |
| `room:join`    | `{ code, playerName }`             | `{ room, playerId }`    |
| `room:leave`   | —                                  | `null`                  |
| `game:start`   | —                                  | `null`                  |
| `game:action`  | `{ action }` (voir `actions.ts`)   | `null`                  |

`game:start` démarre la partie (statut `lobby`) ou la manche suivante (phase `roundOver`).
Seul l'hôte peut l'émettre.

## Serveur → Client

| Événement      | Charge utile            | Description                                  |
| -------------- | ----------------------- | -------------------------------------------- |
| `room:update`  | `RoomSummary`           | État de la salle mis à jour                  |
| `room:closed`  | `{ reason }`            | La salle a été fermée                        |
| `game:state`   | `PublicGameState`       | Vue filtrée propre à chaque joueur           |
| `game:error`   | `{ message }`           | Action refusée ou erreur de jeu              |

### Fermeture automatique des salles (`room:closed`)

Le serveur peut fermer une salle sans action du client. Les joueurs connectés reçoivent
`room:closed` avec un message `reason` explicite ; la salle et les sessions associées
sont supprimées côté serveur.

| Situation | Délai | Message `reason` typique |
| --------- | ----- | ------------------------ |
| Lobby avec moins de joueurs que `minPlayers` | 5 minutes (`LOBBY_INSUFFICIENT_PLAYERS_TIMEOUT_MS`) | `La salle a été fermée : pas assez de joueurs depuis plus de 5 minutes.` |
| Partie en cours : trop peu de joueurs connectés | Immédiat | `Trop de joueurs ont quitté : la partie est terminée.` |

**Lobby insuffisant** : le compte à rebours démarre dès que `players.length < minPlayers`
en statut `lobby`. Il est annulé dès que le minimum est atteint (join ou leave). Un sweep
serveur toutes les 30 s vérifie les salles expirées (`roomIdle.ts`). Les parties
`in-game` ne sont pas concernées par ce délai.

**Côté client** : `GameStateContext` écoute `room:closed`, affiche `reason` et ramène
l'utilisateur à l'accueil.

## Actions de jeu (`game:action`)

`REVEAL_INITIAL` · `DRAW_FROM_PILE` · `TAKE_FROM_DISCARD` · `REPLACE_CARD` ·
`DISCARD_DRAWN` · `FLIP_CARD` (certaines portent un `cardIndex`).
