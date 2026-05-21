import { useEffect, useState } from "react";
import api from "../services/api.ts";
import "../styles/history.css";
import "../styles/styles.css";

const HistoryPage = () => {
  const [games, setGames] = useState<any[]>([]);
  useEffect(() => {
    api.get("/stats/history").then(({ data }) => setGames(data.games || []));
  }, []);
  return (
    <div className="page"><div className="history-container"><h2>Game History</h2><div className="history-list">{games.map((game) => <div className="history-item" key={game._id}><div className="game-header"><span className="game-id">Game #{game._id.slice(-5)}</span><span>{new Date(game.createdAt).toLocaleString()}</span></div><div className="detail-row">Players: {game.players.map((p: any) => p.username).join(", ")}</div></div>)}</div></div></div>
  );
};

export default HistoryPage;
