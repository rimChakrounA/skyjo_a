import { CARD_FLIGHT_DURATION_MS, CAMERA_MAX_ZOOM, COLUMN_CLEAR_DURATION_MS } from '@shared/constants/animation.js';
import type { PublicBoardCell } from '@shared/types/game.js';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { playGameSound } from '@/services/gameSounds';
import { animateArcFlight, cardSizeFromRect, rectCenter } from '@/utils/cardFlight';

export type CameraPulse = 'draw' | 'swap' | 'column' | 'roundEnd' | 'idle';

export type GameSoundId =
  | 'draw'
  | 'place'
  | 'flip'
  | 'columnClear'
  | 'roundWin'
  | 'gameWin'
  | 'button';

export interface FlyingCardVisual {
  id: string;
  cell: PublicBoardCell | { faceUp: false } | { faceUp: true; value: number };
  x: number;
  y: number;
  width: number;
  height: number;
  rot: number;
  scale: number;
}

export interface ColumnClearFx {
  id: string;
  playerId: string;
  col: number;
  rect: DOMRect;
}

interface GameFeelContextValue {
  setAnchor: (key: string, el: HTMLElement | null) => void;
  isAnchorHidden: (key: string) => boolean;
  launchFlight: (
    fromKey: string,
    toKey: string,
    cell: FlyingCardVisual['cell'],
    options?: { arcHeight?: number; rotation?: number; duration?: number; sound?: GameSoundId },
  ) => Promise<void>;
  triggerColumnClear: (playerId: string, col: number) => Promise<void>;
  collapsedColumns: ReadonlyMap<string, ReadonlySet<number>>;
  activeFlights: FlyingCardVisual[];
  columnEffects: ColumnClearFx[];
  camera: { scale: number; x: number; y: number };
  pulseCamera: (pulse: CameraPulse) => void;
  playSound: (id: GameSoundId) => void;
  resetLayout: () => void;
}

const GameFeelContext = createContext<GameFeelContextValue | null>(null);

let flightCounter = 0;

export function GameFeelProvider({ children }: { children: ReactNode }): JSX.Element {
  const anchorsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [hiddenAnchors, setHiddenAnchors] = useState<ReadonlySet<string>>(() => new Set());
  const [activeFlights, setActiveFlights] = useState<FlyingCardVisual[]>([]);
  const [columnEffects, setColumnEffects] = useState<ColumnClearFx[]>([]);
  const [collapsedColumns, setCollapsedColumns] = useState<Map<string, Set<number>>>(() => new Map());
  const [camera, setCamera] = useState({ scale: 1, x: 0, y: 0 });

  const setAnchor = useCallback((key: string, el: HTMLElement | null) => {
    if (el === null) {
      anchorsRef.current.delete(key);
    } else {
      anchorsRef.current.set(key, el);
    }
  }, []);

  const getRect = useCallback((key: string): DOMRect | null => {
    const el = anchorsRef.current.get(key);
    return el?.getBoundingClientRect() ?? null;
  }, []);

  const isAnchorHidden = useCallback(
    (key: string) => hiddenAnchors.has(key),
    [hiddenAnchors],
  );

  const hideAnchors = useCallback((keys: string[]) => {
    setHiddenAnchors((prev) => {
      const next = new Set(prev);
      keys.forEach((key) => next.add(key));
      return next;
    });
  }, []);

  const showAnchors = useCallback((keys: string[]) => {
    setHiddenAnchors((prev) => {
      const next = new Set(prev);
      keys.forEach((key) => next.delete(key));
      return next;
    });
  }, []);

  const pulseCamera = useCallback((pulse: CameraPulse) => {
    if (pulse === 'idle') {
      setCamera({ scale: 1, x: 0, y: 0 });
      return;
    }
    const zoom =
      pulse === 'roundEnd'
        ? 1 - CAMERA_MAX_ZOOM * 1.4
        : pulse === 'column'
          ? 1 - CAMERA_MAX_ZOOM * 0.8
          : 1 + CAMERA_MAX_ZOOM;
    const shiftX = pulse === 'swap' ? CAMERA_MAX_ZOOM * 40 : 0;
    setCamera({ scale: zoom, x: shiftX, y: 0 });
    window.setTimeout(() => setCamera({ scale: 1, x: 0, y: 0 }), pulse === 'roundEnd' ? 600 : 380);
  }, []);

  const playSound = useCallback((id: GameSoundId) => {
    playGameSound(id);
  }, []);

  const launchFlight = useCallback(
    async (
      fromKey: string,
      toKey: string,
      cell: FlyingCardVisual['cell'],
      options: {
        arcHeight?: number;
        rotation?: number;
        duration?: number;
        sound?: GameSoundId;
      } = {},
    ): Promise<void> => {
      const fromRect = getRect(fromKey);
      const toRect = getRect(toKey);
      if (fromRect === null || toRect === null) {
        return;
      }

      const from = rectCenter(fromRect);
      const to = rectCenter(toRect);
      const size = cardSizeFromRect(fromRect);
      const arcHeight = options.arcHeight ?? -48 - Math.random() * 32;
      const rotation = options.rotation ?? (Math.random() - 0.5) * 24;
      const duration = options.duration ?? CARD_FLIGHT_DURATION_MS;
      const id = `flight-${flightCounter++}`;

      hideAnchors([fromKey, toKey]);
      if (options.sound !== undefined) {
        playGameSound(options.sound);
      }

      setActiveFlights((prev) => [
        ...prev,
        {
          id,
          cell,
          x: from.x,
          y: from.y,
          width: size.width,
          height: size.height,
          rot: -rotation * 0.5,
          scale: 1,
        },
      ]);

      await animateArcFlight(
        from,
        to,
        duration,
        arcHeight,
        -rotation * 0.5,
        rotation * 0.3,
        (x, y, rot, scale) => {
          setActiveFlights((prev) =>
            prev.map((f) => (f.id === id ? { ...f, x, y, rot, scale } : f)),
          );
        },
      );

      setActiveFlights((prev) => prev.filter((f) => f.id !== id));
      showAnchors([fromKey, toKey]);
    },
    [getRect, hideAnchors, showAnchors],
  );

  const triggerColumnClear = useCallback(
    async (playerId: string, col: number): Promise<void> => {
      const indices = [0, 1, 2].map((row) => row * 4 + col);
      const firstRect = getRect(`slot:${playerId}:${indices[0]}`);
      if (firstRect === null) {
        return;
      }

      const fxId = `col-${playerId}-${col}-${Date.now()}`;
      setColumnEffects((prev) => [...prev, { id: fxId, playerId, col, rect: firstRect }]);
      pulseCamera('column');
      playGameSound('columnClear');

      const slotKeys = indices.map((i) => `slot:${playerId}:${i}`);
      hideAnchors(slotKeys);

      await new Promise((resolve) => window.setTimeout(resolve, COLUMN_CLEAR_DURATION_MS * 0.55));

      setCollapsedColumns((prev) => {
        const next = new Map(prev);
        const set = new Set(next.get(playerId) ?? []);
        set.add(col);
        next.set(playerId, set);
        return next;
      });

      await new Promise((resolve) => window.setTimeout(resolve, COLUMN_CLEAR_DURATION_MS * 0.45));

      setColumnEffects((prev) => prev.filter((fx) => fx.id !== fxId));
      showAnchors(slotKeys);
    },
    [getRect, hideAnchors, pulseCamera, showAnchors],
  );

  const resetLayout = useCallback(() => {
    setCollapsedColumns(new Map());
  }, []);

  const value = useMemo(
    (): GameFeelContextValue => ({
      setAnchor,
      isAnchorHidden,
      launchFlight,
      triggerColumnClear,
      collapsedColumns,
      activeFlights,
      columnEffects,
      camera,
      pulseCamera,
      playSound,
      resetLayout,
    }),
    [
      setAnchor,
      isAnchorHidden,
      launchFlight,
      triggerColumnClear,
      collapsedColumns,
      activeFlights,
      columnEffects,
      camera,
      pulseCamera,
      playSound,
      resetLayout,
    ],
  );

  return <GameFeelContext.Provider value={value}>{children}</GameFeelContext.Provider>;
}

export function useGameFeel(): GameFeelContextValue {
  const ctx = useContext(GameFeelContext);
  if (ctx === null) {
    throw new Error('useGameFeel must be used within GameFeelProvider');
  }
  return ctx;
}

export function useAnchor(key: string): (el: HTMLElement | null) => void {
  const { setAnchor } = useGameFeel();
  return useCallback(
    (el: HTMLElement | null) => {
      setAnchor(key, el);
    },
    [setAnchor, key],
  );
}
