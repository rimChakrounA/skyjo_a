import { describe, expect, it } from 'vitest';
import { cardTextureStyle } from '@/utils/cardTextures';

describe('cardTextures', () => {
  it('associe chaque plage de valeur à la bonne texture', () => {
    expect(cardTextureStyle({ faceUp: false })?.backgroundImage).toContain('dos.png');
    expect(cardTextureStyle({ faceUp: true, value: -2 })?.backgroundImage).toContain('bleu.png');
    expect(cardTextureStyle({ faceUp: true, value: -1 })?.backgroundImage).toContain('bleu.png');
    expect(cardTextureStyle({ faceUp: true, value: 0 })?.backgroundImage).toContain('cyan.png');
    expect(cardTextureStyle({ faceUp: true, value: 1 })?.backgroundImage).toContain('cyan.png');
    expect(cardTextureStyle({ faceUp: true, value: 3 })?.backgroundImage).toContain('vert.png');
    expect(cardTextureStyle({ faceUp: true, value: 4 })?.backgroundImage).toContain('vert.png');
    expect(cardTextureStyle({ faceUp: true, value: 6 })?.backgroundImage).toContain('jaune.png');
    expect(cardTextureStyle({ faceUp: true, value: 11 })?.backgroundImage).toContain('rouge.png');
    expect(cardTextureStyle({ faceUp: true, value: 12 })?.backgroundImage).toContain('rouge.png');
  });

  it('ne renvoie pas de style pour une cellule absente', () => {
    expect(cardTextureStyle(null)).toBeUndefined();
  });
});
