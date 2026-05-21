
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { getSocket } from "../socket/socket.ts";

type GameState = {
  gameId?: string;
  status?: string;
  players?: any[];
  turnIndex?: number;
  activePlayer?: any;
  diceValue?: number | null;
  boardState?: Record<string, number[]>;
  chatLog?: any[];
  gameLog?: string[];
  turnEndsAt?: number | null;
  ranks?: string[];
};

const GameContext = createContext<{
  socket: ReturnType<typeof getSocket>;
  state: GameState;
  socketConnected: boolean;
  socketError: string | null;
  setState: Dispatch<SetStateAction<GameState>>;
} | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const socket = useMemo(() => getSocket(), []);

  const [state, setState] = useState<GameState>({});
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [socketError, setSocketError] = useState<string | null>(null);

  useEffect(() => {
    const onGameState = (payload: GameState) => {
      setState((prev) => ({
        ...prev,
        ...payload,
        players: payload.players ?? prev.players,
        boardState: payload.boardState ?? prev.boardState,
        chatLog: payload.chatLog ?? prev.chatLog,
        gameLog: payload.gameLog ?? prev.gameLog,
        ranks: payload.ranks ?? prev.ranks,
      }));
    };

    const onConnect = () => {
      setSocketConnected(true);
      setSocketError(null);
    };

    const onDisconnect = () => {
      setSocketConnected(false);
    };

    const onConnectError = (error: Error) => {
      setSocketConnected(false);
      setSocketError(error.message || "Socket error");
    };

    // IMPORTANT: prevent duplicate listeners
    socket.off("game:state");

    socket.on("game:state", onGameState);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("game:state", onGameState);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, [socket]);

  return (
    <GameContext.Provider
      value={{ socket, state, socketConnected, socketError, setState }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
};