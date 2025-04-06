import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: Save user data
    navigate("/map");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign Up</h1>
      <form onSubmit={handleSignup} className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          required
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Sign Up
        </button>
      </form>
      <p>
        Already have an account? <Link to="/">Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
