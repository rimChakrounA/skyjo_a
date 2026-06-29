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

## Actions de jeu (`game:action`)

`REVEAL_INITIAL` · `DRAW_FROM_PILE` · `TAKE_FROM_DISCARD` · `REPLACE_CARD` ·
`DISCARD_DRAWN` · `FLIP_CARD` (certaines portent un `cardIndex`).
