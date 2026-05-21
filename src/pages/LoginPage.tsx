import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import "../styles/styles.css";
import "../styles/login.css";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await login(username, password);
    navigate("/home");
  };

  return <div className="page"><div className="auth-container"><div className="auth-card"><h2>Login</h2><form onSubmit={submit}><input className="form-input" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)} /><input className="form-input" type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} /><button className="form-button">Login</button></form><div className="auth-footer"><Link to="/signup">Sign Up</Link></div></div></div></div>;
};

export default LoginPage;
