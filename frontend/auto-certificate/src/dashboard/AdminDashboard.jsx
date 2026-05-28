import { useState, useEffect } from "react";
import { Check, X, Clock3, Users, Search } from "lucide-react";

// ── HELPERS ───────────────────────────────────────────────────
function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDateTime(isoString) {
  if (!isoString) return "-";
  const d = new Date(isoString);
  return d.toLocaleString("en-US", {
    month: "2-digit", day: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

// transform raw backend user → users table shape
function transformUser(u) {
  return {
    id:       u.id,
    initials: getInitials(u.name),
    name:     u.name,
    email:    u.email,
    role:     u.role?.toLowerCase() ?? "user",
    status:   "active",
  };
}

// transform raw backend progress log → logs table shape
// backend sends: { id, userId, juz, timeStarted, timeFinished,
//                  startedSurah, startedAyah, finishedSurah, finishedAyah,
//                  status, approvedBy, createdAt, user: { id, name, email, role } }
function transformLog(l) {
  return {
    id:         l.id,
    // user info from the nested user object
    initials:   getInitials(l.user?.name ?? ""),
    name:       l.user?.name    ?? "Unknown",
    email:      l.user?.email   ?? "",
    // log fields — map backend keys to frontend keys
    juz:        l.juz,
    startTime:  formatDateTime(l.timeStarted),
    endTime:    formatDateTime(l.timeFinished),
    startSurah: l.startedSurah,
    startAyah:  l.startedAyah,
    endSurah:   l.finishedSurah,
    endAyah:    l.finishedAyah,
    status:     l.status?.toLowerCase() ?? "pending", // "APPROVED" → "approved"
  };
}

// ── SUB COMPONENTS ────────────────────────────────────────────
function Avatar({ initials, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "#27272a", color: "#e4e4e7",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 600, flexShrink: 0,
      border: "1px solid #3f3f46",
    }}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:  { bg: "#422006", color: "#fbbf24", label: "Pending" },
    approved: { bg: "#052e16", color: "#4ade80", label: "Approved" },
    rejected: { bg: "#2d0a0a", color: "#f87171", label: "Rejected" },
    admin:    { bg: "#1e1b4b", color: "#a78bfa", label: "Admin" },
    user:     { bg: "#0c1a2e", color: "#60a5fa", label: "User" },
    active:   { bg: "#052e16", color: "#4ade80", label: "Active" },
    inactive: { bg: "#1c1c1e", color: "#71717a", label: "Inactive" },
  };
  const s = map[status] || map.inactive;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 999,
      fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
}

function SurahCell({ surah, ayah }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 13, color: "#e4e4e7", fontWeight: 500 }}>{surah}</span>
      <span style={{ fontSize: 11, color: "#52525b" }}>Ayah {ayah}</span>
    </div>
  );
}

function UserCell({ initials, name, email }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar initials={initials} size={38} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#f4f4f5" }}>{name}</span>
        <span style={{ fontSize: 11, color: "#52525b" }}>{email}</span>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, hoverBg, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "5px 10px", borderRadius: 8,
        border: `0.5px solid ${hovered ? hoverBg : "#3f3f46"}`,
        background: hovered ? hoverBg : "transparent",
        color: hovered ? "#fff" : "#d4d4d8",
        fontSize: 12, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 4,
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function StatCard({ value, label, color, icon }) {
  return (
    <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "1.25rem", border: "0.5px solid #27272a" }}>
      <div style={{ fontSize: 38, fontWeight: 700, color: color || "#f4f4f5" }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, color: "#71717a", fontSize: 13 }}>
        {icon}
        <span>{label}</span>
      </div>
    </div>
  );
}

const logCols  = "2.4fr 0.7fr 1.5fr 1.5fr 1.5fr 1.5fr 1.2fr";
const userCols = "2fr 2fr 0.8fr 0.9fr 1.2fr";

function TableHead({ cols, headers }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: cols,
      background: "#181818", padding: "13px 20px",
      borderBottom: "0.5px solid #27272a",
      color: "#52525b", fontSize: 12, fontWeight: 600,
      minWidth: 780,
    }}>
      {headers.map(h => <span key={h}>{h}</span>)}
    </div>
  );
}

// ── LOGS TAB ──────────────────────────────────────────────────
function LogsTab({ logs, loading, error, onUpdate }) {
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: "#e4e4e7" }}>
          Pending logs — review and approve/reject
        </span>
      </div>

      <div style={{ border: "0.5px solid #27272a", borderRadius: 16, overflow: "hidden", overflowX: "auto" }}>
        <TableHead cols={logCols} headers={["User", "Juz", "Start Time", "End Time", "Starting Surah", "Ending Surah"]} />

        {loading && (
          <div style={{ padding: "2rem", textAlign: "center", color: "#52525b", fontSize: 13, background: "#121212" }}>
            Loading logs...
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: "2rem", textAlign: "center", color: "#f87171", fontSize: 13, background: "#121212" }}>
            Failed to fetch logs: {error}
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "#52525b", fontSize: 13, background: "#121212" }}>
            No logs found
          </div>
        )}

        {!loading && !error && logs.map((log, i) => (
          <div key={log.id} style={{
            display: "grid", gridTemplateColumns: logCols,
            padding: "14px 20px", alignItems: "center",
            borderBottom: i < logs.length - 1 ? "0.5px solid #1e1e1e" : "none",
            background: "#121212", minWidth: 780,
          }}>
            <UserCell initials={log.initials} name={log.name} email={log.email} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa" }}>Juz {log.juz}</span>
            <span style={{ fontSize: 12, color: "#a1a1aa" }}>{log.startTime}</span>
            <span style={{ fontSize: 12, color: "#a1a1aa" }}>{log.endTime}</span>
            <SurahCell surah={log.startSurah} ayah={log.startAyah} />
            <SurahCell surah={log.endSurah} ayah={log.endAyah} />
            <div style={{ display: "flex", gap: 5 }}>
              <ActionBtn onClick={() => onUpdate(log.id, "approved")} hoverBg="#166534">
                <Check size={13} /> OK
              </ActionBtn>
              <ActionBtn onClick={() => onUpdate(log.id, "rejected")} hoverBg="#991b1b">
                <X size={13} /> No
              </ActionBtn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── USERS TAB ─────────────────────────────────────────────────
function UsersTab({ users, loading, error  }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter(u =>
    (roleFilter === "all" || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: "#e4e4e7" }}>All registered users</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#52525b" }} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: "#1a1a1a", border: "0.5px solid #3f3f46",
                borderRadius: 10, padding: "8px 14px 8px 30px",
                color: "#d4d4d8", fontSize: 13, outline: "none", width: 180,
              }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            style={{
              background: "#1a1a1a", border: "0.5px solid #3f3f46",
              borderRadius: 10, padding: "8px 14px", color: "#d4d4d8",
              fontSize: 13, outline: "none", cursor: "pointer",
            }}
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <div style={{ border: "0.5px solid #27272a", borderRadius: 16, overflow: "hidden" }}>
        <TableHead cols={userCols} headers={["User", "Email", "Role"]} />

        {loading && (
          <div style={{ padding: "2rem", textAlign: "center", color: "#52525b", fontSize: 13, background: "#121212" }}>
            Loading users...
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: "2rem", textAlign: "center", color: "#f87171", fontSize: 13, background: "#121212" }}>
            Failed to fetch users: {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "#52525b", fontSize: 13, background: "#121212" }}>
            No users found
          </div>
        )}

        {!loading && !error && filtered.map((u, i) => (
          <div key={u.id} style={{
            display: "grid", gridTemplateColumns: userCols,
            padding: "14px 20px", alignItems: "center",
            borderBottom: i < filtered.length - 1 ? "0.5px solid #1e1e1e" : "none",
            background: "#121212",
          }}>
            <UserCell initials={u.initials} name={u.name} email={u.email} />
            <span style={{ fontSize: 12, color: "#71717a" }}>{u.email}</span>
            <StatusBadge status={u.role} />
            <div style={{ display: "flex", gap: 5 }}>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab]             = useState("logs");
  const [logs, setLogs]                       = useState([]);
  const [users, setUsers]                     = useState([]);
  const [usersLoading, setUsersLoading]       = useState(false);
  const [usersError, setUsersError]           = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressError, setProgressError]     = useState(null);

  // fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const res  = await fetch("https://quran-monitoring-esrc-nxvsa6j1f-fairuz-physic1.vercel.app/auth/login/getAllUser");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        setUsers(json.data.map(transformUser));
      } catch (err) {
        setUsersError(err.message);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // fetch progress logs
  useEffect(() => {
    const fetchProgress = async () => {
      setProgressLoading(true);
      setProgressError(null);
      try {
        const res  = await fetch("https://quran-monitoring-esrc-nxvsa6j1f-fairuz-physic1.vercel.app/auth/login/getAllProgress");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        const allLogs = json.data.map(transformLog);
        setLogs(allLogs.filter(l => l.status === "pending")); // only show pending
      } catch (err) {
        setProgressError(err.message);
      } finally {
        setProgressLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const updateLog = async (id, newStatus) => {
    try {
      const res = await fetch(`https://quran-monitoring-esrc-nxvsa6j1f-fairuz-physic1.vercel.app/progress/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus.toUpperCase() }), // "APPROVED" or "REJECTED"
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      // remove from list since it ain't pending anymore
      setLogs(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      alert(`Failed to update log: ${err.message}`);
    }
  };

  const deleteUser = (id) => {
    if (window.confirm("Remove this user?"))
      setUsers(prev => prev.filter(u => u.id !== id));
  };

  const pending  = logs.filter(l => l.status === "pending").length;

  return (
    <div style={{ minHeight: "100vh", background: "#111111", color: "#fff", padding: "2.5rem", fontFamily: "'DM Sans', sans-serif" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: "#f4f4f5", margin: 0 }}>Admin Dashboard</h1>
          <p style={{ color: "#71717a", marginTop: 4, fontSize: 14 }}>Manage users & review activity logs</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: "2rem" }}>
        <StatCard value={users.length} label="Total users"  color="#f4f4f5" icon={<Users size={16} />} />
        <StatCard value={pending}      label="Pending logs" color="#fbbf24" icon={<Clock3 size={16} />} />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: "2rem" }}>
        {["logs", "users"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 22px", borderRadius: 12,
              border: `0.5px solid ${activeTab === tab ? "#52525b" : "#3f3f46"}`,
              background: activeTab === tab ? "#27272a" : "transparent",
              color: activeTab === tab ? "#fff" : "#a1a1aa",
              fontSize: 14, fontWeight: activeTab === tab ? 600 : 400,
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {tab === "logs" ? "Activity Logs" : "All Users"}
          </button>
        ))}
      </div>

      {activeTab === "logs"
        ? <LogsTab logs={logs} loading={progressLoading} error={progressError} onUpdate={updateLog} />
        : <UsersTab users={users} loading={usersLoading} error={usersError} onDelete={deleteUser} />
      }
    </div>
  );
}
