import { useEffect, useState } from "react";
import { fetchUser } from "./fecthUser.js";

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_JUZ = 30;

const SURAH_LIST = [
  "Al-Fatihah","Al-Baqarah","Ali 'Imran","An-Nisa","Al-Ma'idah",
  "Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus",
  "Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr",
  "An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha",
  "Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan",
  "Ash-Shu'ara","An-Naml","Al-Qasas","Al-'Ankabut","Ar-Rum",
  "Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir",
  "Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir",
  "Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah",
  "Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf",
  "Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman",
  "Al-Waqi'ah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah",
  "As-Saf","Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq",
  "At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij",
  "Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah",
  "Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","'Abasa",
  "At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj",
  "At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad",
  "Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin",
  "Al-'Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-'Adiyat",
  "Al-Qari'ah","At-Takathur","Al-'Asr","Al-Humazah","Al-Fil",
  "Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr",
  "Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas",
];

const emptyForm = () => ({
  juz:           "1",
  startedSurah:  SURAH_LIST[0],
  startedAyah:   1,
  finishedSurah: SURAH_LIST[0],
  finishedAyah:  1,
  timeStarted:   "",
  timeFinished:  "",
});

const fmt = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-US", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

// ─── Custom Hook ──────────────────────────────────────────────────────────────
function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchUser().then((data) => {
      if (!cancelled) setUser(data);
    });
    return () => { cancelled = true; };
  }, []);

  return user;
}

async function dataProgres() {
  const res = await fetch("https://quran-monitoring-esrc-nxvsa6j1f-fairuz-physic1.vercel.app/auth/login/getProgres", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(),
  });
  const json = await res.json();
  const data = json.data;
  return data;
}

function useProgres() {
  const [progres, setProgres] = useState(null);

  useEffect(() => {
    dataProgres().then((json) => {
      const logs = Array.isArray(json) ? json : (json.data ?? json.progres ?? json.rows ?? []);
      const approvedJuz = logs.filter((l) => l.status === "APPROVED").map((l) => Number(l.juz));
      setProgres({
        logs,
        doneJuz:    approvedJuz.length,
        currentJuz: logs.length > 0 ? Number(logs[0].juz) : null,
      });
    });
  }, []);

  return progres;
}

// ─── Shared UI Components ─────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = {
    APPROVED: { bg: "#0F2E22", color: "#4ADE98", border: "#14532D", label: "✅ Approved" },
    PENDING:  { bg: "#2D1F07", color: "#FCD34D", border: "#713F12", label: "⏳ Pending"  },
    REJECTED: { bg: "#2D0A0A", color: "#F87171", border: "#7F1D1D", label: "❌ Rejected"  },
  }[status] ?? { bg: "#1F2937", color: "#9CA3AF", border: "#374151", label: status };

  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 99,
      background: cfg.bg, color: cfg.color, border: `0.5px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  );
}

const handleLogout = async () => {
  try {
    const res = await fetch("https://quran-monitoring-esrc-nxvsa6j1f-fairuz-physic1.vercel.app/auth/logout", {
      method: "POST",
      credentials: "include", // 👈 THIS is the key — sends & clears the cookie
    });

    if (!res.ok) throw new Error("Logout failed");

    // redirect to login page after logout
    window.location.href = "/login";

  } catch (err) {
    console.error("Logout error:", err);
  }
};

function Req() {
  return <span style={{ color: "#F87171", marginLeft: 2 }}>*</span>;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home",        label: "Home",                 icon: "🏠" },
  { id: "profile",     label: "Profile",              icon: "👤" },
  { id: "logbook",     label: "Logbook",              icon: "📖" },
  { id: "certificate", label: "Download Certificate", icon: "🏆" },
];

function Sidebar({ activePage, onNavigate }) {
  const user = useUser();

  return (
    <aside style={S.sidebar}>
      <div style={S.sidebarLogo}>
        <div style={S.appName}>☽ Khatam Quran</div>
        <div style={S.appSub}>Progress Tracker</div>
      </div>

      <div style={S.userInfo}>
        <div style={S.userName}>{user?.name?.split(" ").slice(0, 2).join(" ") ?? "—"}</div>
      </div>

      <nav style={S.nav}>
        <div style={S.navLabel}>Menu</div>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            style={{ ...S.navItem, ...(activePage === item.id ? S.navItemActive : {}) }}
            onClick={() => onNavigate(item.id)}
          >
            <span style={S.navIcon}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div style={S.logoutBtn}onClick={handleLogout}>
        <span>🚪</span> Logout
      </div>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ title }) {
  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <header style={S.topbar}>
      <div style={S.topbarTitle}>{title}</div>
      <div style={S.topbarRight}>
        <div style={S.badge}>🔔 Notifications</div>
        <div style={S.badge}>📅 {today}</div>
      </div>
    </header>
  );
}

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ done, total }) {
  const pct    = total > 0 ? Math.round((done / total) * 100) : 0;
  const r      = 24;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div style={S.ringWrap}>
      <div style={S.ringLabel}>
        <div style={S.ringPct}>{pct}%</div>
        <div style={S.ringSub}>{done} / {total} Juz</div>
      </div>
      <svg width="60" height="60" viewBox="0 0 60 60" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="30" cy="30" r={r} fill="none" stroke="#374151" strokeWidth="5" />
        <circle cx="30" cy="30" r={r} fill="none" stroke="#1D9E75" strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ─── Juz Grid ─────────────────────────────────────────────────────────────────
function JuzGrid({ doneJuz, currentJuz }) {
  return (
    <>
      <div style={S.juzGrid}>
        {Array.from({ length: TOTAL_JUZ }, (_, i) => i + 1).map((juz) => {
          const isDone    = doneJuz != null && juz < doneJuz;
          const isCurrent = currentJuz != null && juz === currentJuz;
          return (
            <div
              key={juz}
              title={`Juz ${juz}`}
              style={{ ...S.juzBox, ...(isDone ? S.juzDone : isCurrent ? S.juzCurrent : S.juzTodo) }}
            >
              {juz}
            </div>
          );
        })}
      </div>
      <div style={S.legend}>
        <span style={S.legendItem}><span style={{ ...S.legendDot, background: "#0F2E22", border: "0.5px solid #14532D" }} /> Completed</span>
        <span style={S.legendItem}><span style={{ ...S.legendDot, background: "#2D1F07", border: "0.5px solid #713F12" }} /> In Progress</span>
        <span style={S.legendItem}><span style={{ ...S.legendDot, background: "#1F2937", border: "0.5px solid #374151" }} /> Not Started</span>
      </div>
    </>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage() {
  const user       = useUser();
  const progres    = useProgres();
  const doneJuz    = progres?.logs.filter((log) => log.userId === user?.id && 
                     (log.status === "PENDING" || log.status === "APPROVED")).at(-1)?.juz ?? 0;
  const currentJuz = doneJuz != null? Number(doneJuz): null;

  const stats = [
    { label: "Completed Juz", value: doneJuz,   sub: `out of ${TOTAL_JUZ} juz`, icon: "✅" },
  ];

  return (
    <div style={S.pageContent}>
      <div style={S.welcomeCard}>
        <div>
          <h2 style={S.welcomeH2}>Welcome, {user?.name ?? "—"}! 👋</h2>
          <p style={S.welcomeSub}>
            Juz {doneJuz} of {TOTAL_JUZ} completed — keep up the great work! 🤞
          </p>
        </div>
        <ProgressRing done={doneJuz} total={TOTAL_JUZ} />
      </div>

      <div style={S.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} style={S.statCard}>
            <div style={S.statLabel}>{s.icon} {s.label}</div>
            <div style={S.statVal}>{s.value}</div>
            {s.sub && <div style={S.statSub}>{s.sub}</div>}
          </div>
        ))}
      </div>

      <div>
        <div style={S.sectionTitle}>📊 Progress per Juz</div>
        <JuzGrid doneJuz={doneJuz} currentJuz={currentJuz} />
      </div>

      <div style={S.infoGrid}>
        <div style={S.infoCard}>
          <div style={S.infoCardTitle}>👤 Participant Data</div>
          <h1 style={{ color: "#F9FAFB", fontSize: 16, fontWeight: 500 }}>{user?.name ?? "—"}</h1>
        </div>
        <div style={S.infoCard}>
          <div style={S.infoCardTitle}>🏆 Completion Certificate</div>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
            Certificate is available after all 30 juz are completed and verified by an administrator.
          </p>
          <div style={S.certBtnLocked}>🔒 Download Certificate (not yet available)</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 8 }}>
            Remaining: {TOTAL_JUZ - doneJuz} juz to go 💪
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage() {
  const user = useUser();

  return (
    <div style={S.pageContent}>
      <div style={{ ...S.infoCard, maxWidth: 480 }}>
        <div style={S.profileHeader}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: "#F9FAFB" }}>{user?.name ?? "—"}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Khatam Quran 2026 Participant</div>
          </div>
        </div>
        <div style={{ borderTop: "0.5px solid #374151", paddingTop: 16 }}>
          {/* TODO: add profile fields here */}
        </div>
      </div>
    </div>
  );
}

// ─── Logbook Page ─────────────────────────────────────────────────────────────
function LogbookPage() {
  const idUser  = useUser();
  const progres = useProgres();
  const [extraLogs, setExtraLogs] = useState([]);
  const logs = [...(progres?.logs ?? []).filter((l) => l.userId === idUser?.id), ...extraLogs];

  const [form, setForm]             = useState(emptyForm());
  const [loading, setLoading]       = useState(false);
  const [toast, setToast]           = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!idUser?.id) {
      showToast("User is not logged in.", "error"); return;
    }
    if (!form.timeStarted || !form.timeFinished) {
      showToast("Start time and end time are required.", "error"); return;
    }
    if (new Date(form.timeFinished) <= new Date(form.timeStarted)) {
      showToast("End time must be greater than start time.", "error"); return;
    }
    if (Number(form.startedAyah) < 1 || Number(form.finishedAyah) < 1) {
      showToast("Ayah number must be greater than 0.", "error"); return;
    }

    const payload = {
      userId:        idUser?.id,
      juz:           form.juz,
      startedSurah:  form.startedSurah,
      startedAyah:   Number(form.startedAyah),
      finishedSurah: form.finishedSurah,
      finishedAyah:  Number(form.finishedAyah),
      timeStarted:   new Date(form.timeStarted).toISOString(),
      timeFinished:  new Date(form.timeFinished).toISOString(),
    };

    const newEntry = (id) => ({
      ...payload,
      id,
      status: "PENDING",
      approvedBy: null,
      createdAt: new Date().toISOString().slice(0, 10),
    });

    setLoading(true);
    try {
      const res = await fetch("https://quran-monitoring-esrc-nxvsa6j1f-fairuz-physic1.vercel.app/auth/login/receiveData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const saved = await res.json();
      setExtraLogs((prev) => [newEntry(saved.id || Date.now().toString()), ...prev]);
      setForm(emptyForm());
      showToast("Reading log submitted successfully! Awaiting admin approval. 🤞");
    } catch {
      setExtraLogs((prev) => [newEntry(Date.now().toString()), ...prev]);
      setForm(emptyForm());
      showToast("Saved locally (backend not connected). 💾", "warn");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const toastColors = {
    error:   { bg: "#2D0A0A", color: "#F87171", border: "#7F1D1D" },
    warn:    { bg: "#2D1F07", color: "#FCD34D", border: "#713F12" },
    success: { bg: "#0F2E22", color: "#4ADE98", border: "#14532D" },
  };

  // const previewPayload = {
  //   userId:        idUser?.id,
  //   juz:           form.juz,
  //   startedSurah:  form.startedSurah,
  //   startedAyah:   Number(form.startedAyah),
  //   finishedSurah: form.finishedSurah,
  //   finishedAyah:  Number(form.finishedAyah),
  //   timeStarted:   form.timeStarted  ? new Date(form.timeStarted).toISOString()  : "(not filled)",
  //   timeFinished:  form.timeFinished ? new Date(form.timeFinished).toISOString() : "(not filled)",
  // };

  return (
    <div style={S.pageContent}>

      {toast && (() => {
        const c = toastColors[toast.type] ?? toastColors.success;
        return (
          <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 999,
            padding: "12px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500,
            background: c.bg, color: c.color, border: `0.5px solid ${c.border}`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}>
            {toast.msg}
          </div>
        );
      })()}

      <div style={S.infoCard}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#F9FAFB", marginBottom: 4 }}>
          📝 Add Reading Log
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 20 }}>
          This data will be submitted to the server and awaits admin approval before being counted as progress.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={S.formLabel}>Juz <Req /></label>
            <select style={S.formInput} value={form.juz} onChange={(e) => setField("juz", e.target.value)}>
              {Array.from({ length: TOTAL_JUZ }, (_, i) => i + 1).map((j) => (
                <option key={j} value={String(j)}>Juz {j}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={S.formLabel}>Start Time <Req /></label>
            <input type="datetime-local" style={S.formInput}
              value={form.timeStarted} onChange={(e) => setField("timeStarted", e.target.value)} />
          </div>
          <div>
            <label style={S.formLabel}>End Time <Req /></label>
            <input type="datetime-local" style={S.formInput}
              value={form.timeFinished} onChange={(e) => setField("timeFinished", e.target.value)} />
          </div>
        </div>

        <div style={S.formSection}>📖 Start Reading</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={S.formLabel}>Starting Surah <Req /></label>
            <select style={S.formInput} value={form.startedSurah} onChange={(e) => setField("startedSurah", e.target.value)}>
              {SURAH_LIST.map((s, i) => <option key={i} value={s}>{i + 1}. {s}</option>)}
            </select>
          </div>
          <div>
            <label style={S.formLabel}>Starting Ayah <Req /></label>
            <input type="number" min="1" style={S.formInput} value={form.startedAyah}
              onChange={(e) => setField("startedAyah", e.target.value)} placeholder="e.g. 1" />
          </div>
        </div>

        <div style={S.formSection}>🏁 Finish Reading</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 20 }}>
          <div>
            <label style={S.formLabel}>Ending Surah <Req /></label>
            <select style={S.formInput} value={form.finishedSurah} onChange={(e) => setField("finishedSurah", e.target.value)}>
              {SURAH_LIST.map((s, i) => <option key={i} value={s}>{i + 1}. {s}</option>)}
            </select>
          </div>
          <div>
            <label style={S.formLabel}>Ending Ayah <Req /></label>
            <input type="number" min="1" style={S.formInput} value={form.finishedAyah}
              onChange={(e) => setField("finishedAyah", e.target.value)} placeholder="e.g. 286" />
          </div>
        </div>

        {/* <details style={{ marginBottom: 16 }}>
          <summary style={{ fontSize: 12, color: "#6B7280", cursor: "pointer", userSelect: "none", marginBottom: 6 }}>
            🔍 Preview payload to be sent to the API
          </summary>
          <pre style={{
            marginTop: 8, padding: "12px 14px", background: "#0D1117",
            border: "0.5px solid #374151", borderRadius: 8,
            fontSize: 11, color: "#9CA3AF", overflowX: "auto", lineHeight: 1.7,
          }}>
            {JSON.stringify(previewPayload, null, 2)}
          </pre>
        </details> */}

        <button
          style={{ ...S.saveBtn, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "⏳ Submitting..." : "🚀 Submit Log"}
        </button>
      </div>

      <div style={S.sectionTitle}>📋 Log History</div>

      {logs.length === 0 && (
        <div style={{ fontSize: 13, color: "#6B7280", textAlign: "center", padding: "24px 0" }}>
          No logs yet. Start reading! 📖
        </div>
      )}

      {logs.map((log) => (
        <div key={log.id} style={{ ...S.logItem, flexDirection: "column", alignItems: "stretch" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#F9FAFB" }}>Juz {log.juz}</span>
              <StatusBadge status={log.status} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "#6B7280" }}>{log.createdAt}</span>
              <button style={S.expandBtn} onClick={() => toggleExpand(log.id)}>
                {expandedId === log.id ? "▲" : "▼"}
              </button>
            </div>
          </div>

          {expandedId !== log.id && (
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
              {log.startedSurah} :{log.startedAyah} → {log.finishedSurah} :{log.finishedAyah}
            </div>
          )}

          {expandedId === log.id && (
            <div style={{
              marginTop: 12, paddingTop: 12, borderTop: "0.5px solid #1F2937",
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
            }}>
              {[
                ["Juz",           log.juz],
                ["User ID",       log.userId],
                ["Starting Surah",  `${log.startedSurah} : ${log.startedAyah}`],
                ["Ending Surah",    `${log.finishedSurah} : ${log.finishedAyah}`],
                ["Start Time",    fmt(log.timeStarted)],
                ["End Time",      fmt(log.timeFinished)],
                ["Status",        log.status],
                ["Approved By",   log.approvedBy || "—"],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 12, color: "#D1D5DB", fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Certificate Page ─────────────────────────────────────────────────────────
function CertificatePage() {
  const progres    = useProgres();
  const doneJuz    = progres?.logs.at(-1)?.juz != null ? Number(progres.logs.at(-1).juz) : null;
  const pct        = Math.round((doneJuz / TOTAL_JUZ) * 100);
  const isUnlocked = doneJuz >= TOTAL_JUZ;

  return (
    <div style={S.pageContent}>
      <div style={{ ...S.infoCard, maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
        <div style={{ fontSize: 16, fontWeight: 500, color: "#F9FAFB", marginBottom: 8 }}>
          Khatam Quran Certificate
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 24 }}>
          {isUnlocked
            ? "Masya Allah! You have completed the Quran! 🤞 Your certificate is ready to download."
            : `You still need ${TOTAL_JUZ - doneJuz} more juz to go. Keep it up! 💪`}
        </p>
        <div style={S.certProgressWrap}>
          <div style={{ ...S.certProgressBar, width: `${pct}%` }} />
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6, marginBottom: 20 }}>
          {pct}% completed — {doneJuz} / {TOTAL_JUZ} juz
        </div>
        {isUnlocked
          ? <button style={S.certBtnReady}>⬇️ Download Certificate</button>
          : <div style={S.certBtnLocked}>🔒 Download Certificate (locked)</div>}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
const PAGE_TITLES = {
  home:        "Home",
  profile:     "Profile",
  logbook:     "Logbook",
  certificate: "Download Certificate",
};

export default function KhatamQuranDashboard() {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "profile":     return <ProfilePage />;
      case "logbook":     return <LogbookPage />;
      case "certificate": return <CertificatePage />;
      default:            return <HomePage />;
    }
  };

  return (
    <div style={S.app}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div style={S.main}>
        <Topbar title={PAGE_TITLES[activePage]} />
        <div style={S.scrollArea}>{renderPage()}</div>
      </div>
    </div>
  );
}

// ─── Styles (Dark Mode) ───────────────────────────────────────────────────────
const S = {
  app:              { display: "flex", height: "100vh", background: "#0D1117", fontFamily: "system-ui, sans-serif" },
  sidebar:          { width: 220, background: "#161B22", borderRight: "0.5px solid #30363D", display: "flex", flexDirection: "column", flexShrink: 0 },
  sidebarLogo:      { padding: "20px 20px 16px", borderBottom: "0.5px solid #30363D" },
  appName:          { fontSize: 15, fontWeight: 600, color: "#F0F6FF" },
  appSub:           { fontSize: 11, color: "#8B949E", marginTop: 2 },
  userInfo:         { padding: "14px 20px", borderBottom: "0.5px solid #30363D", display: "flex", alignItems: "center", gap: 10 },
  userName:         { fontSize: 13, fontWeight: 500, color: "#F0F6FF" },
  nav:              { flex: 1, padding: "12px 0" },
  navLabel:         { fontSize: 10, color: "#8B949E", padding: "8px 20px 4px", textTransform: "uppercase", letterSpacing: "0.05em" },
  navItem:          { display: "flex", alignItems: "center", gap: 10, padding: "9px 20px", fontSize: 13, color: "#8B949E", cursor: "pointer", borderLeft: "2px solid transparent", transition: "all 0.15s" },
  navItemActive:    { background: "#0F2E22", color: "#4ADE98", borderLeft: "2px solid #1D9E75", fontWeight: 500 },
  navIcon:          { fontSize: 16 },
  logoutBtn:        { padding: "14px 20px", borderTop: "0.5px solid #30363D", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#8B949E", cursor: "pointer" },
  main:             { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar:           { background: "#161B22", borderBottom: "0.5px solid #30363D", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
  topbarTitle:      { fontSize: 15, fontWeight: 500, color: "#F0F6FF" },
  topbarRight:      { display: "flex", alignItems: "center", gap: 12 },
  badge:            { background: "#1C2128", border: "0.5px solid #30363D", borderRadius: 8, padding: "5px 10px", fontSize: 12, color: "#8B949E" },
  scrollArea:       { flex: 1, overflowY: "auto" },
  pageContent:      { padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  welcomeCard:      { background: "#161B22", border: "0.5px solid #30363D", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  welcomeH2:        { fontSize: 16, fontWeight: 500, color: "#F0F6FF", marginBottom: 4 },
  welcomeSub:       { fontSize: 13, color: "#8B949E" },
  ringWrap:         { display: "flex", alignItems: "center", gap: 16 },
  ringLabel:        { textAlign: "right" },
  ringPct:          { fontSize: 22, fontWeight: 600, color: "#4ADE98" },
  ringSub:          { fontSize: 12, color: "#8B949E" },
  statsGrid:        { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  statCard:         { background: "#1C2128", borderRadius: 8, padding: "14px 16px" },
  statLabel:        { fontSize: 12, color: "#8B949E", marginBottom: 6 },
  statVal:          { fontSize: 20, fontWeight: 600, color: "#F0F6FF" },
  statSub:          { fontSize: 11, color: "#8B949E", marginTop: 2 },
  sectionTitle:     { fontSize: 13, fontWeight: 500, color: "#8B949E", marginBottom: 12 },
  juzGrid:          { display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6 },
  juzBox:           { aspectRatio: 1, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, cursor: "pointer", border: "0.5px solid transparent" },
  juzDone:          { background: "#0F2E22", color: "#4ADE98",  border: "0.5px solid #14532D" },
  juzCurrent:       { background: "#2D1F07", color: "#FCD34D",  border: "0.5px solid #713F12" },
  juzTodo:          { background: "#1C2128", color: "#6B7280",  border: "0.5px solid #30363D" },
  legend:           { display: "flex", gap: 16, marginTop: 10, fontSize: 11, color: "#8B949E" },
  legendItem:       { display: "flex", alignItems: "center", gap: 5 },
  legendDot:        { width: 12, height: 12, borderRadius: 3, display: "inline-block" },
  infoGrid:         { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  infoCard:         { background: "#161B22", border: "0.5px solid #30363D", borderRadius: 12, padding: "16px 20px" },
  infoCardTitle:    { fontSize: 12, color: "#8B949E", marginBottom: 12 },
  certBtnLocked:    { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 14px", background: "#1C2128", border: "0.5px solid #30363D", borderRadius: 8, fontSize: 13, color: "#6B7280", cursor: "not-allowed" },
  certBtnReady:     { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 14px", background: "#0F2E22", color: "#4ADE98", border: "0.5px solid #14532D", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", width: "100%" },
  profileHeader:    { display: "flex", alignItems: "center", gap: 16, marginBottom: 20 },
  formLabel:        { fontSize: 12, color: "#8B949E", display: "block", marginBottom: 4 },
  formInput:        { width: "100%", padding: "7px 10px", border: "0.5px solid #374151", borderRadius: 8, background: "#0D1117", color: "#F0F6FF", fontSize: 13, outline: "none", boxSizing: "border-box" },
  formSection:      { fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", margin: "14px 0 10px" },
  saveBtn:          { padding: "9px 22px", background: "#0F2E22", color: "#4ADE98", border: "0.5px solid #14532D", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  logItem:          { background: "#161B22", border: "0.5px solid #30363D", borderRadius: 10, padding: "12px 16px", marginBottom: 8, display: "flex", gap: 0 },
  deleteBtn:        { background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: "2px 6px", borderRadius: 4 },
  expandBtn:        { background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#6B7280", padding: "2px 6px" },
  certProgressWrap: { height: 8, borderRadius: 4, background: "#1C2128", overflow: "hidden", width: "100%" },
  certProgressBar:  { height: "100%", background: "#1D9E75", borderRadius: 4, transition: "width 0.5s ease" },
};
