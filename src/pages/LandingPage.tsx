import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import "../styles/styles.css";
import "../styles/index.css";

const LandingPage = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/home" replace />;
  return (
    <div className="page">
      <div className="hero-container">
        <h1 className="hero-title">🎲 LUDO</h1>
        <p className="hero-subtitle">Classic Board Game Experience</p>
        <div className="form-card">
          <h2>Welcome to LUDO</h2>
          <div className="auth-options">
            <p className="options-label">Join the Game</p>
            <Link to="/login" className="option-button login-button">🔐 Login</Link>
            <Link to="/signup" className="option-button signup-button">✨ Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
