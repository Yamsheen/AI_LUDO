import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import type { ReactElement } from "react";
import Navbar from "./components/Navbar.tsx";
import { useAuth } from "./context/AuthContext.tsx";
import { useGame } from "./context/GameContext.tsx";
import api from "./services/api.ts";
import GamePage from "./pages/GamePage.tsx";
import HealthPage from "./pages/HealthPage.tsx";
import HistoryPage from "./pages/HistoryPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import LeaderboardPage from "./pages/LeaderboardPage.tsx";
import LobbyPage from "./pages/LobbyPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import UpdateProfilePage from "./pages/UpdateProfilePage.tsx";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  const { user } = useAuth();
  const { socketError } = useGame();

  useEffect(() => {
    api
      .get("/health")
      .then(() => {
        console.log("Frontend connected to backend successfully");
      })
      .catch(() => {
        // Deliberately silent; health page and banner handle user-facing status.
      });
  }, []);

  return (
    <>
      {socketError ? (
        <div style={{ background: "#c62828", color: "white", padding: "12px", textAlign: "center" }}>
          SOCKET CONNECTION FAILED: {socketError}
        </div>
      ) : null}
      {user ? <Navbar /> : null}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/newgame/lobby" element={<ProtectedRoute><LobbyPage /></ProtectedRoute>} />
        <Route path="/newgame/:gameId" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/update-profile" element={<ProtectedRoute><UpdateProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
