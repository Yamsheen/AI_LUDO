

import { Server, Socket } from "socket.io";
import Game from "../models/Game.js";
import User from "../models/User.js";
import {
  RoomPlayer,
  RoomState,
  colors,
  getOrCreateRoomState,
  roomStates,
} from "./gameState.js";

const ROOM_CAPACITY = 4;
const TOKENS_PER_PLAYER = 4;
const TRACK_LENGTH = 52;
const HOME_LENGTH = 57;
const TURN_MS = 20_000;

type JoinPayload = {
  gameId: string;
  userId: string;
  username: string;
};

const emitRoomState = (io: Server, state: RoomState): void => {
  io.to(state.gameId).emit("game:state", {
    gameId: state.gameId,
    status: state.status,
    players: state.players,
    turnIndex: state.turnIndex,
    activePlayer: state.players[state.turnIndex] ?? null,
    diceValue: state.diceValue,
    boardState: state.boardState,
    chatLog: state.chatLog,
    gameLog: state.gameLog,
    turnEndsAt: state.timers.turnEndsAt,
    ranks: state.ranks,
  });
};

const nextTurn = (state: RoomState): void => {
  if (state.players.length === 0) return;

  let next = (state.turnIndex + 1) % state.players.length;
  let guard = 0;

  while (state.players[next]?.rank && guard < state.players.length) {
    next = (next + 1) % state.players.length;
    guard++;
  }

  state.turnIndex = next;
  state.diceValue = null;
  state.timers.turnEndsAt = Date.now() + TURN_MS;
};

const getMovableTokens = (positions: number[], diceValue: number): number[] =>
  positions
    .map((position, idx) => ({ position, idx }))
    .filter(({ position }) => {
      if (position === -1) return diceValue === 6;
      if (position >= HOME_LENGTH) return false;
      return position + diceValue <= HOME_LENGTH;
    })
    .map((t) => t.idx);

const applyCapture = (state: RoomState, activeUserId: string, movedTo: number): void => {
  if (movedTo < 0 || movedTo >= TRACK_LENGTH) return;

  state.players.forEach((player) => {
    if (player.userId === activeUserId) return;

    const tokens = state.boardState[player.userId] ?? [];
    state.boardState[player.userId] = tokens.map((pos) =>
      pos === movedTo ? -1 : pos,
    );
  });
};

const getCoinsByRank = (rank: number): number => {
  if (rank === 1) return 50;
  if (rank === 2) return 30;
  if (rank === 3) return 15;
  return 5;
};

const persistFinishedGame = async (state: RoomState): Promise<void> => {
  if (!state.dbGameId) return;

  const game = await Game.findById(state.dbGameId);
  if (!game) return;

  game.status = "finished";
  game.finished_at = new Date();

  game.players = state.players.map((p) => ({
    user_id: p.userId as never,
    username: p.username,
    color: p.color,
    rank: p.rank,
    coins_earned: p.coinsEarned,
  }));

  await game.save();

  await Promise.all(
    state.players.map((player) =>
      User.findByIdAndUpdate(player.userId, {
        $inc: {
          coins: player.coinsEarned,
          total_played: 1,
        },
      }),
    ),
  );
};

const maybeFinishGame = async (io: Server, state: RoomState): Promise<void> => {
  const rankedPlayers = state.players.filter((p) => p.rank !== undefined);
  const finishThreshold = Math.max(1, state.players.length - 1);

  if (rankedPlayers.length < finishThreshold) return;

  state.status = "finished";
  state.timers.turnEndsAt = null;

  state.players
    .filter((p) => p.rank === undefined)
    .forEach((p) => {
      p.rank = state.players.length;
      p.coinsEarned = getCoinsByRank(p.rank);
      state.ranks.push(`${p.username} finished #${p.rank}`);
    });

  await persistFinishedGame(state);

  io.to(state.gameId).emit("game:over", {
    players: state.players,
    ranks: state.ranks,
  });

  emitRoomState(io, state);
};

const onJoin = (io: Server, socket: Socket, payload: JoinPayload): void => {
  const { gameId, userId, username } = payload;

  if (!gameId || !userId || !username) {
    socket.emit("error", { message: "gameId, userId and username required" });
    return;
  }

  const state = getOrCreateRoomState(gameId);
  socket.join(gameId);

  const existing = state.players.find((p) => p.userId === userId);

  if (existing) {
    existing.socketId = socket.id;
    existing.connected = true;
    existing.isAI = false;

    socket.data.roomId = gameId;
    socket.data.userId = userId;

    emitRoomState(io, state);
    return;
  }

  if (state.players.length >= ROOM_CAPACITY) {
    socket.emit("error", { message: "Room is full (max 4 players)" });
    return;
  }

  const usedColors = new Set(state.players.map((p) => p.color));
  const color = colors.find((c) => !usedColors.has(c)) ?? colors[0];

  const player: RoomPlayer = {
    userId,
    socketId: socket.id,
    username,
    color,
    isAI: false,
    connected: true,
    coinsEarned: 0,
  };

  state.players.push(player);
  state.boardState[userId] = [-1, -1, -1, -1];

  socket.data.roomId = gameId;
  socket.data.userId = userId;

  emitRoomState(io, state);
};

const onLeave = (io: Server, socket: Socket): void => {
  const gameId = socket.data.roomId as string | undefined;
  const userId = socket.data.userId as string | undefined;

  if (!gameId || !userId) return;

  const state = roomStates.get(gameId);
  if (!state) return;

  if (state.status === "waiting") {
    state.players = state.players.filter((p) => p.userId !== userId);
    delete state.boardState[userId];
  } else {
    const player = state.players.find((p) => p.userId === userId);
    if (player) {
      player.connected = false;
      player.isAI = true;
      state.gameLog.push(`${player.username} disconnected`);
    }
  }

  socket.leave(gameId);
  emitRoomState(io, state);
  scheduleAiTurn(io, state);
};

const scheduleAiTurn = (io: Server, state: RoomState): void => {
  if (state.timers.aiTimeout) {
    clearTimeout(state.timers.aiTimeout);
  }

  const active = state.players[state.turnIndex];
  if (!active?.isAI) return;

  state.timers.aiTimeout = setTimeout(() => {
    if (state.status !== "playing") {
      return;
    }
    const currentActive = state.players[state.turnIndex];
    if (!currentActive?.isAI) {
      return;
    }
    const diceValue = Math.floor(Math.random() * 6) + 1;
    state.diceValue = diceValue;
    const tokens = state.boardState[currentActive.userId] ?? [];
    const movable = getMovableTokens(tokens, diceValue);
    
    state.gameLog.push(`${currentActive.username} (AI) rolled ${diceValue}`);
    
    if (movable.length > 0) {
      const tokenIndex = movable[Math.floor(Math.random() * movable.length)];
      const current = tokens[tokenIndex];
      const nextPos = current === -1 ? 0 : current + diceValue;
      tokens[tokenIndex] = nextPos;
      state.boardState[currentActive.userId] = tokens;
      applyCapture(state, currentActive.userId, nextPos);
      state.gameLog.push(`${currentActive.username} (AI) moved token ${tokenIndex + 1}`);
      if (tokens.filter((p) => p >= HOME_LENGTH).length === TOKENS_PER_PLAYER && !currentActive.rank) {
        currentActive.rank = state.ranks.length + 1;
        currentActive.coinsEarned = getCoinsByRank(currentActive.rank);
        state.ranks.push(`${currentActive.username} finished #${currentActive.rank}`);
      }
    } else {
      state.gameLog.push(`${currentActive.username} (AI) has no valid moves`);
    }
    
    if (diceValue !== 6) {
      nextTurn(state);
    } else {
      state.diceValue = null;
      state.timers.turnEndsAt = Date.now() + TURN_MS;
    }
    emitRoomState(io, state);
    maybeFinishGame(io, state);
    scheduleAiTurn(io, state);
  }, 1500);
};

const onStart = async (io: Server, socket: Socket): Promise<void> => {
  const gameId = socket.data.roomId as string | undefined;
  if (!gameId) return;
  const state = roomStates.get(gameId);
  if (!state || state.status !== "waiting") return;
  if (state.players.length < 2) {
    socket.emit("error", { message: "At least 2 players are required" });
    return;
  }

  state.status = "playing";
  state.turnIndex = 0;
  state.diceValue = null;
  state.timers.turnEndsAt = Date.now() + TURN_MS;
  state.gameLog.push("Game started");
  const createdGame = await Game.create({
    total_players: state.players.length,
    players: state.players.map((p) => ({
      user_id: p.userId as never,
      username: p.username,
      color: p.color,
      coins_earned: 0,
    })),
    status: "playing",
    started_at: new Date(),
  });
  state.dbGameId = String(createdGame._id);
  io.to(gameId).emit("game:start", { gameId });
  emitRoomState(io, state);
  scheduleAiTurn(io, state);
};

const onRoll = (io: Server, socket: Socket): void => {
  const gameId = socket.data.roomId as string | undefined;
  const userId = socket.data.userId as string | undefined;
  if (!gameId || !userId) return;
  const state = roomStates.get(gameId);
  if (!state || state.status !== "playing") return;

  const active = state.players[state.turnIndex];
  if (!active || active.userId !== userId) {
    socket.emit("error", { message: "Not your turn" });
    return;
  }
  if (state.diceValue !== null) {
    socket.emit("error", { message: "Roll already done for this turn" });
    return;
  }

  state.diceValue = Math.floor(Math.random() * 6) + 1;
  state.gameLog.push(`${active.username} rolled ${state.diceValue}`);

  // Proactive Fix: If no tokens can be moved with this roll, auto-pass the turn!
  const tokens = state.boardState[userId] ?? [];
  const movable = getMovableTokens(tokens, state.diceValue);
  
  if (movable.length === 0) {
    state.gameLog.push(`${active.username} has no valid moves`);
    nextTurn(state);
    scheduleAiTurn(io, state);
  }

  emitRoomState(io, state);
};

const onMove = async (
  io: Server,
  socket: Socket,
  payload: { tokenIndex: number },
): Promise<void> => {
  const gameId = socket.data.roomId as string | undefined;
  const userId = socket.data.userId as string | undefined;
  if (!gameId || !userId) return;

  const state = roomStates.get(gameId);
  if (!state || state.status !== "playing") return;

  const active = state.players[state.turnIndex];
  if (!active || active.userId !== userId) {
    socket.emit("error", { message: "Not your turn" });
    return;
  }

  if (state.diceValue === null) {
    socket.emit("error", { message: "Roll dice first" });
    return;
  }

  const tokenIndex = payload?.tokenIndex;
  const positions = state.boardState[userId] ?? [];
  if (tokenIndex < 0 || tokenIndex >= positions.length) {
    socket.emit("error", { message: "Invalid token index" });
    return;
  }

  const movable = getMovableTokens(positions, state.diceValue);
  if (!movable.includes(tokenIndex)) {
    socket.emit("error", { message: "Invalid move for current dice" });
    return;
  }

  const current = positions[tokenIndex];
  const nextPos = current === -1 ? 0 : current + state.diceValue;
  positions[tokenIndex] = nextPos;
  state.boardState[userId] = positions;
  applyCapture(state, userId, nextPos);
  state.gameLog.push(`${active.username} moved token ${tokenIndex + 1}`);

  const finishedTokens = positions.filter((p) => p >= HOME_LENGTH).length;
  if (finishedTokens === TOKENS_PER_PLAYER && !active.rank) {
    active.rank = state.ranks.length + 1;
    active.coinsEarned = getCoinsByRank(active.rank);
    state.ranks.push(`${active.username} finished #${active.rank}`);
  }

  const extraTurn = state.diceValue === 6;
  if (!extraTurn) {
    nextTurn(state);
  } else {
    state.diceValue = null;
    state.timers.turnEndsAt = Date.now() + TURN_MS;
  }
  emitRoomState(io, state);
  await maybeFinishGame(io, state);
  scheduleAiTurn(io, state);
};

const onChat = (io: Server, socket: Socket, payload: { message: string }): void => {
  const gameId = socket.data.roomId as string | undefined;
  if (!gameId || !payload?.message?.trim()) return;
  const state = roomStates.get(gameId);
  if (!state) return;
  const userId = socket.data.userId as string | undefined;
  const player = state.players.find((p) => p.userId === userId);
  if (!player) return;
  const message = {
    username: player.username,
    message: payload.message.slice(0, 200),
    timestamp: Date.now(),
  };
  state.chatLog.push(message);
  io.to(gameId).emit("chat:new", message);
  emitRoomState(io, state);
};

/* ------------------------------------------------------------------ */
/* 🔥 IMPORTANT EXPORT (FIX FOR YOUR ERROR) */
/* ------------------------------------------------------------------ */

export const registerGameSocketHandlers = (io: Server): void => {
  io.on("connection", (socket) => {
    socket.on("room:join", (payload: JoinPayload) =>
      onJoin(io, socket, payload),
    );
    socket.on("game:start", async () => onStart(io, socket));
    socket.on("game:roll", () => onRoll(io, socket));
    socket.on("game:move", async (payload: { tokenIndex: number }) =>
      onMove(io, socket, payload),
    );
    socket.on("chat:send", (payload: { message: string }) => onChat(io, socket, payload));

    socket.on("room:leave", () => onLeave(io, socket));

    socket.on("disconnect", () => onLeave(io, socket));
  });
};