import { describe, expect, it } from 'vitest';
import { assignPlayerAvatars } from '@/utils/playerAvatar';

describe('assignPlayerAvatars', () => {
  it('retourne le même mapping pour la même composition de joueurs', () => {
    const ids = ['p2', 'p1', 'p3'];
    expect(assignPlayerAvatars(ids)).toEqual(assignPlayerAvatars([...ids].reverse()));
  });

  it('assigne un avatar différent à chaque joueur', () => {
    const avatars = assignPlayerAvatars(['a', 'b', 'c', 'd']);
    const emojis = [...avatars.values()].map((avatar) => avatar.emoji);
    expect(new Set(emojis).size).toBe(emojis.length);
  });

  it('retourne un emoji et une couleur de fond par joueur', () => {
    const avatars = assignPlayerAvatars(['player-1']);
    const avatar = avatars.get('player-1');
    expect(avatar?.emoji.length).toBeGreaterThan(0);
    expect(avatar?.background).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});
