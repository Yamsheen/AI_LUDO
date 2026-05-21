import { PlayerColor } from "../models/Game.js";

export type TokenPosition = number;

export type RoomPlayer = {
  userId: string;
  socketId: string;
  username: string;
  color: PlayerColor;
  isAI: boolean;
  connected: boolean;
  rank?: number;
  coinsEarned: number;
};

export type ChatMessage = {
  username: string;
  message: string;
  timestamp: number;
};

export type RoomState = {
  gameId: string;
  dbGameId?: string;
  status: "waiting" | "playing" | "finished";
  players: RoomPlayer[];
  turnIndex: number;
  diceValue: number | null;
  boardState: Record<string, TokenPosition[]>;
  chatLog: ChatMessage[];
  gameLog: string[];
  timers: {
    turnEndsAt: number | null;
    aiTimeout?: NodeJS.Timeout;
  };
  ranks: string[];
};

export const roomStates = new Map<string, RoomState>();
export const colors: PlayerColor[] = ["red", "blue", "green", "yellow"];

export const createInitialRoomState = (gameId: string): RoomState => ({
  gameId,
  status: "waiting",
  players: [],
  turnIndex: 0,
  diceValue: null,
  boardState: {},
  chatLog: [],
  gameLog: [],
  timers: {
    turnEndsAt: null,
  },
  ranks: [],
});

export const getOrCreateRoomState = (gameId: string): RoomState => {
  const existing = roomStates.get(gameId);
  if (existing) {
    return existing;
  }
  const state = createInitialRoomState(gameId);
  roomStates.set(gameId, state);
  return state;
};
