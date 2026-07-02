import { describe, expect, it } from 'vitest';
import { visibleBoardStats } from '@/utils/visibleBoardStats';

describe('visibleBoardStats', () => {
  it('somme les cartes face visible', () => {
    const cells = [
      { faceUp: true, value: 5 },
      { faceUp: true, value: 3 },
      { faceUp: false },
      null,
    ] as const;

    expect(visibleBoardStats(cells)).toEqual({ sum: 8, count: 2 });
  });

  it('renvoie zéro sans cartes visibles', () => {
    expect(visibleBoardStats([{ faceUp: false }, null])).toEqual({ sum: 0, count: 0 });
  });
});
