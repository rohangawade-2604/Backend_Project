import { useEffect, useState } from "react";
import { useSocket } from "../socket/useSocket";

export default function PrescriptionLive() {
  const { socket, isConnected } = useSocket();
  const [data, setData] = useState([]);
  const [matchResult, setMatchResult] = useState(null); // ✅ add this

  useEffect(() => {
    if (!socket) return;

    console.log("🟡 Listening for events...");

    const handler = (msg) => {
      console.log("🔥 RECEIVED:", msg); // check this in browser console

      // ✅ msg.prescription — the prescription data
      setData((prev) => [msg.prescription, ...prev]);

      // ✅ msg.matchResult — the match result
      setMatchResult(msg.matchResult);
    };

    socket.on("prescriptionAdded", handler);

    return () => {
      socket.off("prescriptionAdded", handler);
    };
  }, [socket]);

  return (
    <div style={{ padding: "1rem" }}>

      {/* Connection Status */}
      <h3>
        Status:{" "}
        <span style={{ color: isConnected ? "green" : "red" }}>
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </span>
      </h3>

      {/* ✅ Match Result Section */}
      {matchResult && (
        <div style={{
          background: "#f0fdf4",
          border: "2px solid #22c55e",
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1rem"
        }}>
          <h2>🏏 Match Result</h2>
          <p><strong>{matchResult.teamA}</strong> — {matchResult.teamAScore} runs</p>
          <p><strong>{matchResult.teamB}</strong> — {matchResult.teamBScore} runs</p>
          <p>🏆 Winner: <strong>{matchResult.Result}</strong></p>
          <p>📅 Date: {matchResult.date}</p>
        </div>
      )}

      {/* ✅ Prescriptions Section */}
      <h2>💊 Live Prescriptions</h2>
      {data.length === 0 ? (
        <p>Waiting for data... (check console for 🔥 RECEIVED)</p>
      ) : (
        <ul>
          {data.map((item, i) => (
            <li key={i} style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderLeft: "4px solid #6366f1",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "8px"
            }}>
              <strong>Dr. {item?.DrName}</strong> | 
              📞 {item?.DrNumber} | 
              💊 {item?.Brand} | 
              SCC: {item?.SccCode}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}