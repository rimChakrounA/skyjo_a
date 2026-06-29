import { describe, expect, it } from 'vitest';
import { removeMatchingColumns } from '../src/game/columns.js';
import { buildBoard } from './helpers.js';

const upAll = Array.from({ length: 12 }, () => true);

describe('removeMatchingColumns', () => {
  it('supprime une colonne de trois cartes identiques et révélées', () => {
    // Colonne 0 = index 0, 4, 8.
    const board = buildBoard([7, 1, 2, 3, 7, 4, 5, 6, 7, 8, 9, 10], upAll);
    const { board: next, removed } = removeMatchingColumns(board);
    expect(removed).toEqual([7, 7, 7]);
    expect(next.cells[0]).toBeNull();
    expect(next.cells[4]).toBeNull();
    expect(next.cells[8]).toBeNull();
  });

  it('ne supprime pas une colonne si une carte est cachée', () => {
    const faceUp = [...upAll];
    faceUp[8] = false;
    const board = buildBoard([7, 1, 2, 3, 7, 4, 5, 6, 7, 8, 9, 10], faceUp);
    const { removed } = removeMatchingColumns(board);
    expect(removed).toEqual([]);
  });

  it('ne supprime pas une colonne de valeurs différentes', () => {
    const board = buildBoard([7, 1, 2, 3, 8, 4, 5, 6, 9, 8, 9, 10], upAll);
    const { removed } = removeMatchingColumns(board);
    expect(removed).toEqual([]);
  });
});
