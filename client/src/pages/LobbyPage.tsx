import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { useGame } from "../context/GameContext.tsx";
import "../styles/lobby.css";
import "../styles/styles.css";

const LobbyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, state } = useGame();
  const gameId = useMemo(() => "global-lobby", []);

  useEffect(() => {
    if (!user) return;
    socket.emit("room:join", { gameId, userId: user.id || user._id, username: user.username });
    const onStart = ({ gameId: startedId }: { gameId: string }) => navigate(`/newgame/${startedId}`);
    socket.on("game:start", onStart);
    return () => {
      socket.off("game:start", onStart);
    };
  }, [socket, user, gameId, navigate]);

  useEffect(() => {
    if (state.status === "playing") {
      navigate(`/newgame/${state.gameId || gameId}`);
    }
  }, [state.status, state.gameId, gameId, navigate]);

  const count = state.players?.length || 0;
  return (
    <div className="page"><div className="lobby-container"><div className="lobby-card"><h2>Game Lobby</h2>
      <div className="players-grid">{(state.players || []).map((p) => <div key={p.userId} className="player-slot filled"><div className="player-slot-name">{p.username}</div><div className={`player-slot-color ${p.color}`}></div></div>)}</div>
      <button className="start-button" disabled={count < 2} onClick={() => socket.emit("game:start")}>Start Game ({count}/4)</button>
    </div></div></div>
  );
};

export default LobbyPage;
