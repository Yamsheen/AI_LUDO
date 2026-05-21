import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import "../styles/home.css";
import "../styles/styles.css";

const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className="page">
      <div className="dashboard-container">
        <div className="dashboard-header"><h2>Welcome, {user?.username}!</h2></div>
        <div className="dashboard-grid">
          <div className="dashboard-card play-card"><h3>Play Game</h3><Link to="/newgame/lobby" className="card-button">Start Playing</Link></div>
          <div className="dashboard-card leaderboard-card"><h3>Leaderboard</h3><Link to="/leaderboard" className="card-button">View Rankings</Link></div>
          <div className="dashboard-card history-card"><h3>Game History</h3><Link to="/history" className="card-button">View History</Link></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
