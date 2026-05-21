import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox.tsx";
import DicePanel from "../components/DicePanel.tsx";
import GameLog from "../components/GameLog.tsx";
import LudoBoard from "../components/LudoBoard.tsx";
import PlayerCard from "../components/PlayerCard.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { useGame } from "../context/GameContext.tsx";
import "../styles/game.css";
import "../styles/styles.css";

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, state } = useGame();
  const [winnerOpen, setWinnerOpen] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!user || !gameId) return;
    socket.emit("room:join", { gameId, userId: user.id || user._id, username: user.username });
    const onOver = () => setWinnerOpen(true);
    socket.on("game:over", onOver);
    return () => {
      socket.off("game:over", onOver);
    };
  }, [socket, user, gameId]);

  useEffect(() => {
    if (!state.turnEndsAt || !state.activePlayer || !user) return;
    
    const checkTimer = () => {
      const msLeft = state.turnEndsAt! - Date.now();
      if (
        msLeft <= 0 &&
        state.activePlayer?.userId === (user.id || user._id)
      ) {
        if (state.diceValue === null) {
          socket.emit("game:roll");
        } else {
          // Auto move if they have valid moves but time expired
          const myId = user.id || user._id;
          const myTokens = state.boardState?.[myId] || [-1, -1, -1, -1];
          const movableIdxs = myTokens
            .map((pos, idx) => ({ pos, idx }))
            .filter(({ pos }) =>
              pos === -1 ? state.diceValue === 6 : pos + (state.diceValue ?? 0) <= 57,
            )
            .map((x) => x.idx);
            
          if (movableIdxs.length > 0) {
            socket.emit("game:move", { tokenIndex: movableIdxs[0] });
          }
        }
      }
    };

    const intervalId = setInterval(() => {
      setNow(Date.now());
      checkTimer();
    }, 1000);
    checkTimer();

    return () => clearInterval(intervalId);
  }, [state.turnEndsAt, state.activePlayer, state.diceValue, user, socket]);

  const myId = user?.id || user?._id;
  const myTokens = (myId && state.boardState?.[myId]) || [-1, -1, -1, -1];
  const movable = useMemo(() => {
    if (!state.diceValue) return [];
    return myTokens
      .map((pos, idx) => ({ pos, idx }))
      .filter(({ pos }) =>
        pos === -1 ? state.diceValue === 6 : pos + (state.diceValue ?? 0) <= 57,
      )
      .map((x) => x.idx);
  }, [myTokens, state.diceValue]);
  const canRoll = state.activePlayer?.userId === myId && state.diceValue === null;
  const secondsLeft = Math.max(0, Math.floor(((state.turnEndsAt || now) - now) / 1000));

  return (
    <div className="page">
      <div className="layout">
        <aside><DicePanel canRoll={canRoll} value={state.diceValue ?? null} onRoll={() => socket.emit("game:roll")} secondsLeft={secondsLeft} />{(state.players || []).map((p) => <PlayerCard key={p.userId} player={p} isActive={p.userId === state.activePlayer?.userId} />)}</aside>
        <div className="board-area"><LudoBoard tokens={myTokens} movable={movable} onMove={(tokenIndex) => socket.emit("game:move", { tokenIndex })} /></div>
        <aside><ChatBox chatLog={state.chatLog || []} onSend={(message) => socket.emit("chat:send", { message })} /><GameLog logs={state.gameLog || []} ranks={state.ranks || []} /></aside>
      </div>
      {winnerOpen ? <div className="victory-overlay"><div className="victory-card"><h2>Game Over</h2><div className="vc-actions"><button className="btn btn-success" onClick={() => navigate("/newgame/lobby")}>Play Again</button><button className="btn btn-muted" onClick={() => navigate("/home")}>Main Menu</button></div></div></div> : null}
    </div>
  );
};

export default GamePage;
