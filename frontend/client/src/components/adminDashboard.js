import React, { useState } from "react";
import Navbar from "./Navbar";
import EventList from "./EventList";
import CreateChallenge from "./CreateChallenge";

const AdminDashboard = () => {
  const [page, setPage] = useState("home");

  return (
    <div style={dashboardContainer}>
      <Navbar setPage={setPage} />
      <div style={contentStyle}>
        {page === "home" ? <EventList /> : <CreateChallenge />}
      </div>
    </div>
  );
};

// Styles for layout adjustment
const dashboardContainer = {
  display: "flex",
  height: "100vh",
  background: "#F4F5F7",
};

const contentStyle = {
  marginLeft: "250px", // Adjust for sidebar width
  flex: 1,
  padding: "20px",
  overflowY: "auto",
};

export default AdminDashboard;
