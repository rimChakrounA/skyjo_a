import { describe, expect, it } from 'vitest';
import { countCompletedColumns } from '@/utils/boardColumns';

describe('countCompletedColumns', () => {
  it('compte les colonnes entièrement retirées', () => {
    const cells = Array.from({ length: 12 }, () => ({ faceUp: true, value: 4 } as const));
    cells[0] = null;
    cells[4] = null;
    cells[8] = null;

    expect(countCompletedColumns(cells)).toBe(1);
  });

  it('ignore les colonnes partiellement vides', () => {
    const cells = Array.from({ length: 12 }, () => ({ faceUp: false } as const));
    cells[0] = null;

    expect(countCompletedColumns(cells)).toBe(0);
  });
});
