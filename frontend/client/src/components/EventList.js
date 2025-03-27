import React, { useEffect, useState } from "react";
import axios from "axios";

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios
      .get("http://localhost:5000/admin/competitions", { withCredentials: true })
      .then(res => setEvents(res.data.competitions))
      .catch(err => console.error("Error fetching events:", err));
  };

  const handleStart = (id) => {
    axios
      .post(`http://localhost:5000/admin/dashboard/start/${id}`, {}, { withCredentials: true })
      .then(() => {
        alert("Competition started!");
        fetchEvents(); // Refresh the list after update
      })
      .catch(err => console.error("Error starting competition:", err));
  };

  const handleStop = (id) => {
    axios
      .post(`http://localhost:5000/admin/dashboard/end/${id}`, {}, { withCredentials: true })
      .then(() => {
        alert("Competition stopped!");
        fetchEvents(); // Refresh the list after update
      })
      .catch(err => console.error("Error stopping competition:", err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Events List</h1>
      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {events.length > 0 ? (
          events.map(event => (
            <div key={event._id} style={cardStyle}>
              <h3>{event.event_name}</h3>
              <p><strong>Date: </strong> {event.date}</p>
              <p><strong>Status: </strong> {event.status}</p>
              <p><strong>Challenge ID: </strong> {event.challenge_id}</p>

              {/* Start/Stop Buttons */}
              <div style={buttonContainerStyle}>
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: event.status === "upcoming" ? "#28a745" : "#a5d6a7",
                    boxShadow: event.status === "upcoming" ? "0 4px 10px rgba(40, 167, 69, 0.3)" : "none",
                    cursor: event.status === "upcoming" ? "pointer" : "not-allowed"
                  }}
                  onClick={() => handleStart(event.event_id)}
                  disabled={event.status !== "upcoming"}
                >
                  Start
                </button>

                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: event.status === "ongoing" ? "#dc3545" : "#f5b7b1",
                    boxShadow: event.status === "ongoing" ? "0 4px 10px rgba(220, 53, 69, 0.3)" : "none",
                    cursor: event.status === "ongoing" ? "pointer" : "not-allowed"
                  }}
                  onClick={() => handleStop(event.event_id)}
                  disabled={event.status !== "ongoing"}
                >
                  End
                </button>
              </div>

              {/* Winners Section */}
              {event.status !== "upcoming" && event.winners.length > 0 && (
                <div>
                  <strong>Winners:</strong>
                  <ul>
                    {event.winners.map((winnerList, index) => (
                      <li key={index}>
                        {getMedal(index)}: {winnerList.join(", ")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No competitions found.</p>
        )}
      </div>
    </div>
  );
};

// Function to get the proper ranking title
const getMedal = (index) => {
  const medals = ["🥇 1st Prize", "🥈 2nd Prize", "🥉 3rd Prize"];
  return medals[index] || `${index + 1}th Prize`;
};

// Inline Styles
const cardStyle = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)"
};

const buttonContainerStyle = {
  marginTop: "10px",
  display: "flex",
  gap: "10px"
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
  color: "white",
  transition: "all 0.3s ease-in-out",
};

export default EventList;
