import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { toast } from "react-toastify";

const Login = ({ darkMode }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const name = email.split("@")[0];

    try {
      const res = await fetch("http://localhost:5020/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        navigate("/map");
      } else {
        toast.error("User login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
    }
  };

  return (
    <div className={`${styles.wrapper} ${darkMode ? "dark" : ""}`}>
  <div className={styles.overlay} />
  <div className={styles.centeredContent}>
    <h1 className={styles.appName}>Travel Health Adviser</h1>
    <h1 className={styles.title}>Login</h1>
    <form onSubmit={handleLogin} className={styles.form}>
      <input
        type="email"
        placeholder="Email"
        required
        className={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        className={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className={styles.button}>
        Login
      </button>
    </form>
    <p>
      Don't have an account? <Link to="/signup">Sign up</Link>
    </p>
  </div>
</div>

  );
};

export default Login;
