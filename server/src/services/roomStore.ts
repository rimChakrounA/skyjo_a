import type { Room } from './room.js';

/** Stockage en mémoire des salles. Les parties en cours ne sont jamais persistées. */
export class RoomStore {
  private readonly rooms = new Map<string, Room>();

  has(code: string): boolean {
    return this.rooms.has(code);
  }

  get(code: string): Room | undefined {
    return this.rooms.get(code);
  }

  set(room: Room): void {
    this.rooms.set(room.code, room);
  }

  delete(code: string): void {
    this.rooms.delete(code);
  }

  all(): Room[] {
    return [...this.rooms.values()];
  }

  get size(): number {
    return this.rooms.size;
  }
}

/** Instance partagée utilisée par les gestionnaires Socket.IO. */
export const roomStore = new RoomStore();
