import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import "../styles/styles.css";
import "../styles/home.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home" className="navbar-title">🎲 LUDO</Link>
      </div>
      <div className="navbar-right">
        <div className="coin-display">
          <span className="coin-icon">💰</span>
          <span className="coin-amount">{user.coins} Coins</span>
        </div>
        <div className="user-dropdown">
          <button className="dropdown-btn">{user.username} ▼</button>
          <div className="dropdown-menu">
            <Link to="/update-profile" className="dropdown-item">Update Profile</Link>
            <button
              className="dropdown-item logout-btn"
              onClick={async () => {
                await logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
