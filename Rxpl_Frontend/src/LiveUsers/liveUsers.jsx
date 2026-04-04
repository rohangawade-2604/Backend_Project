import { useEffect, useState } from "react";
// import { useSocket } from "../hooks/useSocket";
import { useSocket } from "../socket/useSocket"; // 👈 adjust path as needed

const roleColors = {
  TLM: { bg: "#EEEDFE", color: "#534AB7" },
  SLM: { bg: "#E6F1FB", color: "#185FA5" },
  FLM: { bg: "#E1F5EE", color: "#0F6E56" },
  MR:  { bg: "#FAEEDA", color: "#854F0B" },
};

const avatarColors = {
  TLM: { bg: "#EEEDFE", color: "#3C3489" },
  SLM: { bg: "#E6F1FB", color: "#0C447C" },
  FLM: { bg: "#E1F5EE", color: "#085041" },
  MR:  { bg: "#FAEEDA", color: "#633806" },
};

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function LiveUsers() {
  const { socket, isConnected } = useSocket(); // ✅ reuse your existing hook
  const [users, setUsers] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  useEffect(() => {
    if (!socket) return; // ✅ wait until socket is ready

    // ✅ Ask backend for current live users as soon as socket is ready
    socket.emit("getLiveUsers");

    // ✅ Listen for live users list from backend
    socket.on("liveUsers", (data) => {
      const sorted = [...data].sort((a, b) => b.status - a.status);
      setUsers(sorted);
    });

    return () => {
      socket.off("liveUsers"); // ✅ cleanup only this listener
    };
  }, [socket]); // ✅ re-runs when socket becomes available

  const handleLogout = async (userId) => {
    setLoadingIds((prev) => [...prev, userId]);
    try {
      const res = await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });
      const data = await res.json();
      if (!data.success) alert(data.message || "Logout failed");
    } catch {
      alert("Could not reach server");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  const onlineCount = users.filter((u) => u.status).length;
  const offlineCount = users.length - onlineCount;

  return (
    <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto", fontFamily: "sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: isConnected ? "#1D9E75" : "#E24B4A",
            display: "inline-block"
          }} />
          <span style={{ fontSize: "16px", fontWeight: "500" }}>Live Users</span>
        </div>
        <span style={{
          fontSize: "12px", padding: "3px 10px", borderRadius: "6px",
          background: isConnected ? "#EAF3DE" : "#FCEBEB",
          color: isConnected ? "#3B6D11" : "#A32D2D",
          border: `0.5px solid ${isConnected ? "#C0DD97" : "#F7C1C1"}`
        }}>
          {isConnected ? "connected" : "disconnected"}
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
        {[
          { label: "Total users", value: users.length, color: "inherit" },
          { label: "Online now",  value: onlineCount,  color: "#1D9E75" },
          { label: "Offline",     value: offlineCount, color: "inherit" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#f5f5f5", borderRadius: "8px", padding: "12px 14px" }}>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>{s.label}</div>
            <div style={{ fontSize: "22px", fontWeight: "500", color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* User Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {users.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: "14px" }}>
            {isConnected ? "No users found" : "Connecting to server..."}
          </div>
        ) : (
          users.map((user) => (
            <div key={user.userId} style={{
              background: "#fff",
              border: `0.5px solid ${user.status ? "#C0DD97" : "#e0e0e0"}`, // ✅ green border for online
              borderRadius: "12px", padding: "12px 16px",
              display: "flex", alignItems: "center", gap: "12px"
            }}>

              {/* Avatar */}
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: "500",
                background: avatarColors[user.role]?.bg || "#eee",
                color: avatarColors[user.role]?.color || "#333",
              }}>
                {getInitials(user.Username)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.username || user.userId}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>{user.userId}</span>
                  <span style={{
                    fontSize: "11px", padding: "2px 7px", borderRadius: "6px", fontWeight: "500",
                    background: roleColors[user.role]?.bg || "#eee",
                    color: roleColors[user.role]?.color || "#333",
                  }}>
                    {user.role}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>
                  {user.status
                    ? `Logged in at ${formatTime(user.loginTime)}`
                    : `Last seen ${formatTime(user.logoutTime)}`}
                </div>
              </div>

              {/* Status + Logout */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                <span style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  fontSize: "12px", padding: "3px 10px", borderRadius: "99px",
                  background: user.status ? "#EAF3DE" : "#f5f5f5",
                  color: user.status ? "#3B6D11" : "#888",
                }}>
                  <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: user.status ? "#1D9E75" : "#ccc"
                  }} />
                  {user.status ? "online" : "offline"}
                </span>

                {user.status && (
                  <button
                    onClick={() => handleLogout(user.userId)}
                    disabled={loadingIds.includes(user.userId)}
                    style={{
                      fontSize: "12px", padding: "4px 12px", borderRadius: "6px",
                      border: "0.5px solid #F7C1C1", background: "#FCEBEB",
                      color: "#A32D2D", cursor: "pointer",
                      opacity: loadingIds.includes(user.userId) ? 0.5 : 1,
                    }}
                  >
                    {loadingIds.includes(user.userId) ? "Logging out..." : "Logout"}
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}