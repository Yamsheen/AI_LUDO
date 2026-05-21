export const roomStates = new Map();
export const colors = ["red", "blue", "green", "yellow"];
export const createInitialRoomState = (gameId) => ({
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
export const getOrCreateRoomState = (gameId) => {
    const existing = roomStates.get(gameId);
    if (existing) {
        return existing;
    }
    const state = createInitialRoomState(gameId);
    roomStates.set(gameId, state);
    return state;
};
//# sourceMappingURL=gameState.js.map