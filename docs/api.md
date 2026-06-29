# API REST

Les routes REST servent uniquement aux opérations non temps réel. Préfixe : `/api`.

## `GET /api/health`

Vérifie l'état du serveur.

```json
{ "status": "ok", "uptime": 12.34 }
```

## `GET /api/games/:id`

Récupère une partie terminée par son identifiant.

- `200` : la partie terminée (avec ses joueurs et scores) ;
- `404` : aucune partie trouvée.

```json
{
  "id": "uuid",
  "code": "ABCDE",
  "rounds": 5,
  "winnerId": "...",
  "winnerName": "Alice",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "players": [{ "playerId": "...", "name": "Alice", "score": 42 }]
}
```
