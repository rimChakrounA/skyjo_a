import type { CSSProperties } from 'react';
import type { PublicBoardCell } from '@shared/types/game.js';
import type { CardValue } from '@shared/types/game.js';
import { assetUrl } from '@/utils/assetUrl';

/** bleu.png = texture violette (valeurs négatives). */
const TEXTURES = {
  back: assetUrl('cards/dos.png'),
  violet: assetUrl('cards/bleu.png'),
  cyan: assetUrl('cards/cyan.png'),
  green: assetUrl('cards/vert.png'),
  yellow: assetUrl('cards/jaune.png'),
  red: assetUrl('cards/rouge.png'),
} as const;

function textureForValue(value: CardValue): string {
  if (value === -2 || value === -1) {
    return TEXTURES.violet;
  }
  if (value === 0 || value === 1) {
    return TEXTURES.cyan;
  }
  if (value === 3 || value === 4) {
    return TEXTURES.green;
  }
  if (value >= 5 && value <= 8) {
    return TEXTURES.yellow;
  }
  if (value >= 9 && value <= 12) {
    return TEXTURES.red;
  }
  // Valeur 2 non citée : regroupée avec le cyan (0, 1) par proximité.
  return TEXTURES.cyan;
}

function textureUrl(cell: PublicBoardCell): string | null {
  if (cell === null) {
    return null;
  }
  if (!cell.faceUp) {
    return TEXTURES.back;
  }
  return textureForValue(cell.value);
}

export function cardTextureStyle(cell: PublicBoardCell): CSSProperties | undefined {
  const url = textureUrl(cell);
  if (url === null) {
    return undefined;
  }
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
}
