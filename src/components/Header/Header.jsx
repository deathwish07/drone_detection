import React from "react";
import "./header.css";

const Header = () => {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>YOLO Drone Detection</h1>
      <nav>
        <ul style={styles.navList}>
          <li><a href="/" style={styles.navItem}>Home</a></li>
          <li><a href="#image" style={styles.navItem}>Image Detection</a></li>
          <li><a href="#real" style={styles.navItem}>Real Time Detection</a></li>
          <li><a href="#about" style={styles.navItem}>About us</a></li>
        </ul>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "1.5em",
  },
  navList: {
    listStyleType: "none",
    display: "flex",
    margin: 0,
    padding: 0,
  },
  navItem: {
    color: "#fff",
    textDecoration: "none",
    margin: "0 10px",
    fontSize: "1em",
  },
};

export default Header;
