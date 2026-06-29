import { DECK_SIZE } from '@shared/constants/game.js';
import { describe, expect, it } from 'vitest';
import { createDeck, shuffle } from '../src/game/deck.js';
import { createSeededRng } from '../src/game/rng.js';

describe('createDeck', () => {
  it('crée un paquet de 150 cartes', () => {
    expect(createDeck()).toHaveLength(DECK_SIZE);
  });

  it('respecte la composition officielle', () => {
    const deck = createDeck();
    const count = (value: number): number => deck.filter((card) => card === value).length;
    expect(count(-2)).toBe(5);
    expect(count(-1)).toBe(10);
    expect(count(0)).toBe(15);
    expect(count(12)).toBe(10);
  });
});

describe('shuffle', () => {
  it('est déterministe pour une même graine', () => {
    const deck = createDeck();
    const a = shuffle(deck, createSeededRng(42));
    const b = shuffle(deck, createSeededRng(42));
    expect(a).toEqual(b);
  });

  it('produit un ordre différent pour des graines différentes', () => {
    const deck = createDeck();
    const a = shuffle(deck, createSeededRng(1));
    const b = shuffle(deck, createSeededRng(2));
    expect(a).not.toEqual(b);
  });

  it('conserve toutes les cartes du paquet', () => {
    const deck = createDeck();
    const shuffled = shuffle(deck, createSeededRng(7));
    expect([...shuffled].sort((x, y) => x - y)).toEqual([...deck].sort((x, y) => x - y));
  });
});
