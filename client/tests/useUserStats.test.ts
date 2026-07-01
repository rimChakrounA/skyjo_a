import { describe, expect, it } from 'vitest';
import { getUserLevel, getWinRate } from '@/hooks/useUserStats';

describe('useUserStats helpers', () => {
  it('calcule le taux de victoire', () => {
    expect(getWinRate(0, 0)).toBe(0);
    expect(getWinRate(10, 3)).toBe(30);
  });

  it('attribue le niveau débutant sans victoire', () => {
    expect(getUserLevel(0)).toEqual({ level: 1, label: 'Débutant' });
  });
});
