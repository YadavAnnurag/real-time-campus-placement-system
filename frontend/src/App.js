import "./App.css";

import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("NOT APPLIED");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5001");

    ws.onopen = () => console.log("WS connected");
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setStatus(data.status);
    };
    ws.onerror = () => console.log("WS error");

    return () => ws.close();
  }, []);

  const updateStatus = async (newStatus) => {
    await fetch("http://localhost:5000/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  return (
  <div className="container">
    <div className="card">
      <h2 className="title">
        Real-Time Campus Placement & Application Tracking System
      </h2>

      <div className="section">
        <h3>Student View</h3>
        <p>
          Status: <span className="status">{status}</span>
        </p>

        <button
          className="apply-btn"
          onClick={() => updateStatus("APPLIED")}
          disabled={status !== "NOT APPLIED"}
        >
          Apply
        </button>
      </div>

      <hr />

      <div className="section">
        <h3>Admin View</h3>
        <button
          className="shortlist-btn"
          onClick={() => updateStatus("SHORTLISTED")}
        >
          Shortlist
        </button>
        <button
          className="reject-btn"
          onClick={() => updateStatus("REJECTED")}
        >
          Reject
        </button>
      </div>
    </div>
  </div>
);
}

export default App;
