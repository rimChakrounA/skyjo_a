import { describe, expect, it } from 'vitest';
import { inferCardMotion } from '@/utils/cardMotion';

describe('inferCardMotion', () => {
  it('détecte la révélation d’une carte', () => {
    expect(inferCardMotion('hidden', { faceUp: true, value: 5 })).toBe('reveal');
  });

  it('détecte le remplacement d’une carte', () => {
    expect(inferCardMotion('up:3', { faceUp: true, value: 7 })).toBe('replace');
  });

  it('détecte le retrait d’une colonne', () => {
    expect(inferCardMotion('up:2', null)).toBe('removed');
  });

  it('reste idle sans changement', () => {
    expect(inferCardMotion('hidden', { faceUp: false })).toBe('idle');
  });
});
