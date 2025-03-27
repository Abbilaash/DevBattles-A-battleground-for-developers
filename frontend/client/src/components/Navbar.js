import React from "react";

const Navbar = ({ setPage }) => {
  return (
    <nav style={navStyle}>
      <h1 style={titleStyle}>Admin Portal</h1>
      <div style={buttonContainerStyle}>
        <button onClick={() => setPage("home")} style={navButtonStyle}>Home</button>
        <button onClick={() => setPage("create")} style={navButtonStyle}>Create Challenge</button>
      </div>
    </nav>
  );
};

// Inline Styles for the Left Sidebar
const navStyle = {
  width: "250px",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  background: "#1E1E2F",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "20px",
  color: "white",
  boxShadow: "5px 0 15px rgba(0, 0, 0, 0.3)"
};

const titleStyle = {
  marginBottom: "40px",
  fontSize: "30px",
  fontWeight: "bold",
  textAlign: "center"
};

const buttonContainerStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const navButtonStyle = {
  width: "80%",
  padding: "12px",
  fontSize: "16px",
  fontWeight: "bold",
  border: "none",
  borderRadius: "10px",
  background: "#2D2D44",
  color: "white",
  marginBottom: "30px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px"
};

// Hover effect
navButtonStyle[":hover"] = {
  background: "#4A4A6A",
  transform: "scale(1.05)"
};

export default Navbar;
