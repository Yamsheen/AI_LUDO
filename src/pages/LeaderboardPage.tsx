import { useEffect, useState } from "react";
import api from "../services/api.ts";
import "../styles/leaderboard.css";
import "../styles/styles.css";

const LeaderboardPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    api.get("/stats/leaderboard").then(({ data }) => setUsers(data.users || []));
  }, []);
  return (
    <div className="page"><div className="leaderboard-container"><h2>Global Leaderboard</h2><table className="leaderboard-table"><thead><tr><th>Rank</th><th>Username</th><th>Games</th><th>Coins</th></tr></thead><tbody>{users.map((u, i) => <tr key={u._id || i}><td>{i + 1}</td><td>{u.username}</td><td>{u.total_played}</td><td>{u.coins}</td></tr>)}</tbody></table></div></div>
  );
};

export default LeaderboardPage;
