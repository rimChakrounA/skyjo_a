const PLAYER_AVATARS = [
  '🧑',
  '👩',
  '🤖',
  '🦊',
  '🐻',
  '🦁',
  '🐼',
  '🎭',
  '👨',
  '🧒',
  '🐸',
  '🦄',
] as const;

const AVATAR_BACKGROUNDS = [
  '#FFE4B5',
  '#E8F4FD',
  '#FADBD8',
  '#D5F5E3',
  '#E8DAEF',
  '#FDEBD0',
  '#D6EAF8',
  '#F9E79F',
  '#F5CBA7',
  '#D7BDE2',
  '#A9DFBF',
  '#F1948A',
] as const;

export interface PlayerAvatar {
  emoji: string;
  background: string;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function shuffledIndices(count: number, seed: number): number[] {
  const indices = Array.from({ length: count }, (_, index) => index);
  let state = seed || 1;

  for (let i = indices.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) | 0;
    const j = Math.abs(state) % (i + 1);
    [indices[i], indices[j]] = [indices[j]!, indices[i]!];
  }

  return indices;
}

function avatarAtIndex(index: number): PlayerAvatar {
  return {
    emoji: PLAYER_AVATARS[index]!,
    background: AVATAR_BACKGROUNDS[index]!,
  };
}

/** Assigne un avatar unique à chaque joueur de la partie (stable pour une même composition). */
export function assignPlayerAvatars(playerIds: readonly string[]): Map<string, PlayerAvatar> {
  const sortedIds = [...new Set(playerIds)].sort();
  const rosterSeed = hashString(sortedIds.join('|'));
  const pool = shuffledIndices(PLAYER_AVATARS.length, rosterSeed);

  const map = new Map<string, PlayerAvatar>();
  sortedIds.forEach((id, index) => {
    map.set(id, avatarAtIndex(pool[index]!));
  });

  return map;
}
