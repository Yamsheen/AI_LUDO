import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import "../styles/styles.css";
import "../styles/signup.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    username: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await signup(form);
    navigate("/home");
  };
  return <div className="page"><div className="auth-container"><div className="auth-card"><h2>Sign Up</h2><form onSubmit={submit}><input className="form-input" placeholder="username" value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})} /><input className="form-input" type="date" value={form.dob} onChange={(e)=>setForm({...form, dob:e.target.value})} /><input className="form-input" type="password" placeholder="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} /><input className="form-input" type="password" placeholder="confirm password" value={form.confirmPassword} onChange={(e)=>setForm({...form, confirmPassword:e.target.value})} /><button className="form-button">Create Account</button></form><div className="auth-footer"><Link to="/login">Login</Link></div></div></div></div>;
};

export default SignupPage;
