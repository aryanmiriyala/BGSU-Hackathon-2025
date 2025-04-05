import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: Save user data
    navigate("/map");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sign Up</h1>
      <form onSubmit={handleSignup} style={styles.form}>
        <input type="text" placeholder="Name" required style={styles.input} />
        <input type="email" placeholder="Email" required style={styles.input} />
        <input
          type="password"
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Sign Up
        </button>
      </form>
      <p>
        Already have an account? <Link to="/">Log in</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "250px",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#1f2937",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Signup;
