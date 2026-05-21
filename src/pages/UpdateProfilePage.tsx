import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import api from "../services/api.ts";
import "../styles/styles.css";
import "../styles/update-profile.css";

const UpdateProfilePage = () => {
  const { user, refreshMe } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [password, setPassword] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await api.put("/auth/update-profile", { username, dob, password });
    await refreshMe();
    navigate("/home");
  };

  return (
    <div className="page"><div className="profile-container"><div className="profile-card"><form onSubmit={submit}><input className="form-input" value={username} onChange={(e)=>setUsername(e.target.value)} /><input className="form-input" type="date" value={dob} onChange={(e)=>setDob(e.target.value)} /><input className="form-input" type="password" placeholder="new password optional" value={password} onChange={(e)=>setPassword(e.target.value)} /><button className="btn-save">Save Changes</button></form></div></div></div>
  );
};

export default UpdateProfilePage;
