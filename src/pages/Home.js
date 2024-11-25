import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to Object Detection</h1>
      <p>Choose a detection method below:</p>
      <div style={styles.buttonContainer}>
        <Link to="/" style={styles.link}>
          <button style={styles.button}>Real-Time Detection</button>
        </Link>
        <Link to="/image" style={styles.link}>
          <button style={styles.button}>Image Detection</button>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px 20px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
  },
  button: {
    padding: "15px 30px",
    fontSize: "18px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textDecoration: "none",
  },
  link: {
    textDecoration: "none",
  },
};

export default Home;
