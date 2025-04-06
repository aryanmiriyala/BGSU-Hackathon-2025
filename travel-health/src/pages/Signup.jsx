import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; // We can reuse the same styles
import { toast } from "react-toastify";

const Signup = ({ darkMode }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const name = email.split("@")[0];

    try {
      const res = await fetch("http://localhost:5020/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        toast.success("Registration successful!");
        navigate("/health-form");
      } else {
        toast.error("Registration failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during registration.");
    }
  };

  return (
    <div className={`${styles.wrapper} ${darkMode ? "dark" : ""}`}>
      <div className={styles.overlay} />
      <div className={styles.centeredContent}>
        <h1 className={styles.appName}>Travel Health Adviser</h1>
        <h1 className={styles.title}>Sign Up</h1>
        <form onSubmit={handleSignup} className={styles.form}>
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
          <input
            type="password"
            placeholder="Confirm Password"
            required
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className={styles.button}>
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
