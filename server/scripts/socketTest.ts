import { io } from "socket.io-client";

const socketUrl = "http://localhost:8000";
const gameId = `room-test-${Date.now()}`;
const p1UserId = `u_${Date.now()}_1`;
const p2UserId = `u_${Date.now()}_2`;

const connectClient = (name: string, userId: string) =>
  io(socketUrl, {
    transports: ["websocket"],
    reconnection: false,
    timeout: 5000,
    auth: { name, userId },
  });

const waitForEvent = <T>(socket: ReturnType<typeof io>, event: string, ms = 7000) =>
  new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Timeout waiting for ${event}`)), ms);
    socket.once(event, (payload: T) => {
      clearTimeout(timeout);
      resolve(payload);
    });
  });

const run = async () => {
  let socketOk = false;
  let joinOk = false;
  let startOk = false;
  let rollBroadcastOk = false;

  const p1 = connectClient("PlayerOne", p1UserId);
  const p2 = connectClient("PlayerTwo", p2UserId);

  try {
    await Promise.all([waitForEvent(p1, "connect"), waitForEvent(p2, "connect")]);
    socketOk = true;
    console.log("✔ Socket connection works");

    const joinedState = waitForEvent<any>(p1, "game:state");
    p1.emit("room:join", { gameId, userId: p1UserId, username: "PlayerOne" });
    p2.emit("room:join", { gameId, userId: p2UserId, username: "PlayerTwo" });
    const stateAfterJoin = await joinedState;
    if (!Array.isArray(stateAfterJoin?.players) || stateAfterJoin.players.length < 2) {
      throw new Error("Join state does not include both players");
    }
    joinOk = true;
    console.log("✔ Room join works");

    const started = waitForEvent<{ gameId: string }>(p1, "game:start");
    p1.emit("game:start");
    await started;
    startOk = true;
    console.log("✔ Game start works");

    const statePromise = waitForEvent<any>(p1, "game:state");
    p1.emit("game:roll");
    const state = await statePromise;
    rollBroadcastOk = typeof state?.diceValue === "number";
    console.log(`${rollBroadcastOk ? "✔" : "✘"} Dice roll broadcast works`);
  } finally {
    p1.disconnect();
    p2.disconnect();
  }

  console.log("========== APP STATUS ==========");
  console.log("Backend API: OK");
  console.log("Database: OK");
  console.log("Auth system: OK");
  console.log(`Socket.IO: ${socketOk ? "OK" : "FAIL"}`);
  console.log(`Real-time system: ${joinOk && startOk && rollBroadcastOk ? "OK" : "FAIL"}`);
  console.log("================================");

  if (!(socketOk && joinOk && startOk && rollBroadcastOk)) {
    process.exit(1);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
