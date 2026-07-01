---
name: Design system Skyjo
description: Charte visuelle et composants UI du client Skyjo. À utiliser pour toute refonte, nouvel écran ou composant frontend.
---

# Design system Skyjo

## Stack UI

- **CSS Modules** uniquement (pas de Tailwind, pas de lib UI).
- **Tokens** centralisés dans `client/src/styles/tokens.css`.
- **Composants de base** dans `client/src/components/ui/`.
- Polices : **Fredoka** (titres / logo / boutons), **Nunito** (corps de texte).

## Tokens obligatoires

Toujours utiliser les variables CSS `--color-*`, `--space-*`, `--radius-*`, `--font-*`, `--shadow-*`.

Ne jamais hardcoder de couleurs hex dans les modules CSS (sauf dans `tokens.css`).

Alias legacy (`--primary`, `--surface`, etc.) existent pour compatibilité — préférer les tokens `--color-*` dans le nouveau code.

## Composants UI

| Composant | Usage |
|-----------|--------|
| `Button` | Actions (`primary`, `accent`, `secondary`, `navy`, `ghost` ; `sm`/`md`/`lg` ; prop `icon`) |
| `Panel` | Cartes blanches arrondies, option `glass` |
| `Badge` | Statuts (hôte, en ligne, phase de jeu) |
| `Field` | Label + enfant + message d'erreur |
| `Input` / `Select` | Champs de formulaire |

Importer depuis `@/components/ui`.

## Composants page d'accueil

| Composant | Usage |
|-----------|--------|
| `SkyjoLogo` | Wordmark + ruban « ONLINE » |
| `LiveStatsBar` | Stats live (parties, joueurs, salles) |
| `CardDeckDecor` | Fan de cartes animé (desktop) |
| `PlayersIllustration` | SVG joueurs autour d'une table |

Dans `client/src/components/home/`. Layout scène via `MainLayout variant="scene"`.

## Identité visuelle

- Fond : dégradé ciel (bleu → horizon doré) + collines CSS + soleil animé.
- Ambiance : lumineuse, playful, outdoor — inspirée d'un jeu casual web/mobile.
- Action créer : **vert** (`--color-primary`).
- Action rejoindre : **bleu** (`--color-accent`).
- Connexion : **marine** (`--color-navy`).
- Surfaces : cartes blanches avec ombres douces (`--shadow-card`).

## Cartes Skyjo

Couleurs par valeur dans `CardView.module.css` :

- Négatif : bleu
- Zéro : cyan
- Bas (1–4) : vert
- Moyen (5–8) : jaune
- Haut (9–12) : rouge

Carte cachée : dégradé ardoise.

## Animations

Définies dans `global.css` :

- `fadeUp` — entrée des blocs
- `float` — cartes décoratives
- `sunPulse` — soleil en arrière-plan

Utiliser avec parcimonie ; pas de sur-animation.

## Assets statiques

Structure obligatoire dans `client/public/assets/` :

| Dossier | Contenu |
|---------|---------|
| `background/` | Ciel, collines, table, paysages |
| `characters/` | Illustrations joueurs, avatars |
| `cards/` | Faces Skyjo, dos de cartes, fan décoratif |
| `icons/` | Icônes UI (nav, stats, boutons) |
| `decorations/` | Soleil, deck 3D, éléments décoratifs |

**Conventions**

- Chemin Vite : `/assets/{dossier}/{fichier}` (ex. `/assets/icons/trophy.svg`)
- Nommage : `kebab-case` — `players-table.svg`, `sky.webp`, `deck-stack.webp`
- SVG pour icônes et illustrations vectorielles ; WebP (ou PNG) pour textures/photos
- Migrer progressivement les SVG inline (`PlayersIllustration`, `CardDeckDecor`) vers ces dossiers
- Décoratif : `alt=""` + `aria-hidden="true"` ; informatif : `alt` descriptif en français

## Règles

- Un écran = au moins un `Panel` ou une section avec `--color-surface-elevated`.
- Boutons : toujours `Button`, pas de `<button>` nu sauf dans `CardView`.
- Espacements : multiples de `--space-*`, pas de valeurs arbitraires sauf cas exceptionnel.
- Responsive : grille 2 colonnes → stack vertical ≤ 768px sur l'accueil.
- Accessibilité : `:focus-visible` sur éléments interactifs, contraste suffisant.

## Fichiers clés

```
client/public/assets/                # visuels statiques (background, icons…)
client/src/styles/tokens.css           # source de vérité des tokens
client/src/styles/global.css           # reset, body, keyframes
client/src/components/ui/              # composants réutilisables
client/src/components/home/            # décor et blocs accueil
client/src/pages/HomePage.module.css   # scène paysage
client/src/layouts/MainLayout.tsx      # variant="scene" pour accueil
```

## Extension

Pour un nouvel écran :

1. Composer avec `Panel`, `Button`, `Field`, `Badge`.
2. Créer un `.module.css` local pour la mise en page uniquement.
3. Réutiliser les tokens, ne pas dupliquer les styles de composants UI.
4. Accueil : `MainLayout variant="scene"` ; autres pages : `default`.
