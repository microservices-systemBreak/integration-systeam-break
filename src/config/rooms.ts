// src/config/rooms.ts
import type { RoomId } from "./devices";

export type Room = {
  id: RoomId;
  name: string;
};

export const ROOMS: Room[] = [
  { id: "1", name: "Sala 1" },
  { id: "2", name: "Sala 2" },
  { id: "3", name: "Sala 3" },
  { id: "4", name: "Sala 4" },
];
