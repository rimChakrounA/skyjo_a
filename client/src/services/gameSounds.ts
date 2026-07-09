/** Sons courts (< 200 ms) via Web Audio — aucun asset externe. */

type SoundId =
  | 'draw'
  | 'place'
  | 'flip'
  | 'columnClear'
  | 'roundWin'
  | 'gameWin'
  | 'button';

let audioCtx: AudioContext | null = null;
let muted = false;

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }
  if (audioCtx === null) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function tone(
  frequency: number,
  durationMs: number,
  type: OscillatorType = 'sine',
  gain = 0.08,
  when = 0,
): void {
  const ac = ctx();
  if (ac === null || muted) {
    return;
  }
  void ac.resume();
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  g.gain.setValueAtTime(gain, ac.currentTime + when);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + when + durationMs / 1000);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(ac.currentTime + when);
  osc.stop(ac.currentTime + when + durationMs / 1000 + 0.02);
}

export function playGameSound(id: SoundId): void {
  switch (id) {
    case 'draw':
      tone(520, 90, 'triangle', 0.06);
      tone(680, 70, 'sine', 0.04, 0.04);
      break;
    case 'place':
      tone(380, 80, 'sine', 0.07);
      break;
    case 'flip':
      tone(440, 60, 'triangle', 0.05);
      tone(560, 50, 'sine', 0.04, 0.05);
      break;
    case 'columnClear':
      tone(620, 70, 'sine', 0.06);
      tone(780, 90, 'triangle', 0.05, 0.06);
      tone(920, 60, 'sine', 0.03, 0.12);
      break;
    case 'roundWin':
      tone(523, 100, 'sine', 0.07);
      tone(659, 100, 'sine', 0.06, 0.1);
      tone(784, 120, 'triangle', 0.05, 0.2);
      break;
    case 'gameWin':
      tone(440, 90, 'sine', 0.06);
      tone(554, 90, 'sine', 0.06, 0.08);
      tone(659, 90, 'sine', 0.06, 0.16);
      tone(880, 140, 'triangle', 0.05, 0.24);
      break;
    case 'button':
      tone(480, 45, 'sine', 0.04);
      break;
    default:
      break;
  }
}

export function setGameSoundsMuted(value: boolean): void {
  muted = value;
}
