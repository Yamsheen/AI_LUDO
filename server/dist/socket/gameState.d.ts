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
export declare const roomStates: Map<string, RoomState>;
export declare const colors: PlayerColor[];
export declare const createInitialRoomState: (gameId: string) => RoomState;
export declare const getOrCreateRoomState: (gameId: string) => RoomState;
//# sourceMappingURL=gameState.d.ts.map