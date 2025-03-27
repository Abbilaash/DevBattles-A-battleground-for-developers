import React, { useState } from "react";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/login",
        { email, password },
        { withCredentials: true }
      );
      console.log(response.data);
      window.location.href = "/admin/dashboard"; // Redirect after login
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ 
      height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", 
      background: darkMode ? "#1E1E1E" : "linear-gradient(135deg, #00c6ff, #0072ff)", 
      transition: "background 0.5s ease-in-out"
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.2)", padding: "30px", width: "350px", borderRadius: "15px",
        backdropFilter: "blur(15px)", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)", textAlign: "center",
        transition: "transform 0.3s ease"
      }}>
        <h2 style={{ color: "#fff", fontSize: "24px", marginBottom: "15px" }}>Admin Login</h2>

        {error && <p style={{ color: "#ff4b4b", fontSize: "14px", marginBottom: "10px" }}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label style={{ color: "#fff", fontSize: "14px" }}>Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%", padding: "10px", borderRadius: "5px", border: "none", fontSize: "16px",
                marginTop: "5px"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label style={{ color: "#fff", fontSize: "14px" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%", padding: "10px", borderRadius: "5px", border: "none", fontSize: "16px",
                marginTop: "5px"
              }}
            />
          </div>

          <button type="submit" style={{
            width: "100%", background: "#0072ff", color: "white", border: "none",
            padding: "10px", fontSize: "18px", borderRadius: "5px", cursor: "pointer",
            transition: "background 0.3s ease-in-out"
          }}>
            Login
          </button>
        </form>

        <button onClick={() => setDarkMode(!darkMode)} style={{
          background: "none", border: "none", color: "white", fontSize: "14px", cursor: "pointer",
          marginTop: "10px", transition: "opacity 0.3s ease-in-out"
        }}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </div>
  );
};
// TODO: create a toggle switch for darkmode instead if button

export default AdminLogin;
