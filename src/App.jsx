import { useState, useEffect } from "react";

const PAIN_POINTS = [
  "No centralized job tracking",
  "Manual data entry / double entry",
  "Poor team communication",
  "Estimating is slow or inaccurate",
  "No visibility into job profitability",
  "Scheduling conflicts",
  "Difficult to track job status",
  "Customer communication gaps",
  "No mobile access in the field",
  "Invoicing & payment delays",
  "Photo / document management issues",
  "Lead tracking / follow-up falling through cracks",
];

const INTEGRATIONS = [
  "QuickBooks Online",
  "QuickBooks Desktop",
  "CompanyCam",
  "Product/SKU Import",
  "Contact Import",
  "Hover / EagleView",
  "Google Calendar Sync",
  "3rd Party Calendar",
  "Payments / Financing",
  "QXO",
  "SRS",
  "ABC Supply",
];

const MILESTONES = [
  "Data import / migration",
  "Team training",
  "Created 2 Layouts",
  "Send 5 Estimates",
  "Download mobile app",
  "21+ Job Status Changes",
  "Added team members",
  "Boards / Workflows configured",
  "Daily Logins",
];

const TIMELINE_OPTIONS = [
  "ASAP",
  "2–4 weeks",
  "1–2 months",
  "3+ months",
  "No hard deadline",
];

const QUICK_LINKS = [
  {
    label: "Next Session",
    url: "https://meetings.hubspot.com/grant-cole1/ob-session-2?uuid=04392d34-b509-41f3-bd8f-a63088515c22",
    color: "#a78bfa",
  },
  {
    label: "QuickBooks",
    url: "https://meetings.hubspot.com/bethany-braithwaite/new-qb-onboarding-pre-setup-meeting?uuid=1976156f-7b95-43eb-8fc5-95d010734081",
    color: "#60a5fa",
  },
  {
    label: "Product Import Sheet",
    url: "https://docs.google.com/spreadsheets/d/1OMm4blsHlkLijHuO38DCdJPPkUlQ7Fjq/edit?gid=721715684#gid=721715684",
    color: "#34d399",
  },
  {
    label: "Public API Docs",
    url: "https://documenter.getpostman.com/view/3919598/S11PpG4x",
    color: "#fbbf24",
  },
  {
    label: "Data Migration",
    url: "https://info.jobnimbus.com/data-migration",
    color: "#f0abfc",
  },
  {
    label: "▶ Getting Started",
    url: "https://www.youtube.com/playlist?list=PLhFIpnghwSHmeUoOdHZDDz7AfmguaHouU",
    color: "#f87171",
  },
];

const EMPTY_SESSION = {
  clientName: "",
  date: new Date().toISOString().slice(0, 10),
  hsTicketUrl: "",
  painPoints: [],
  customPainPoints: [],
  integrations: [],
  customIntegrations: [],
  milestones: [],
  customMilestones: [],
  timeline: "",
  goLiveDate: "",
  notes: "",
};

// ── Reusable UI ────────────────────────────────────────────────────────────────

function Section({ title, color, children }) {
  return (
    <div
      style={{
        background: "#111",
        border: `1px solid ${color}22`,
        borderRadius: 8,
        marginBottom: 20,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: `${color}18`,
          borderBottom: `1px solid ${color}33`,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{ width: 3, height: 16, background: color, borderRadius: 2 }}
        />
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
            color,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

function CheckGrid({ items, selected, onToggle, color }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
        gap: 8,
      }}
    >
      {items.map((item) => {
        const active = selected.includes(item);
        return (
          <button
            key={item}
            onClick={() => onToggle(item)}
            style={{
              background: active ? `${color}22` : "#1a1a1a",
              border: `1px solid ${active ? color : "#2a2a2a"}`,
              borderRadius: 6,
              padding: "8px 12px",
              color: active ? "#f0f0f0" : "#666",
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                border: `1.5px solid ${active ? color : "#444"}`,
                background: active ? color : "transparent",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {active && (
                <span style={{ color: "#000", fontSize: 10, fontWeight: 900 }}>
                  ✓
                </span>
              )}
            </div>
            {item}
          </button>
        );
      })}
    </div>
  );
}

function CustomTags({ items, onAdd, onRemove, color, placeholder }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !items.includes(v)) {
      onAdd(v);
      setInput("");
    }
  };
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 6,
            padding: "7px 12px",
            color: "#ccc",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          onClick={add}
          style={{
            background: `${color}22`,
            border: `1px solid ${color}55`,
            color,
            borderRadius: 6,
            padding: "7px 14px",
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
          }}
        >
          + Add
        </button>
      </div>
      {items.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {items.map((item) => (
            <span
              key={item}
              style={{
                background: `${color}15`,
                border: `1px solid ${color}33`,
                borderRadius: 20,
                padding: "3px 10px 3px 12px",
                color: "#aaa",
                fontSize: 12,
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {item}
              <button
                onClick={() => onRemove(item)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#555",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── To-Do Checklist ────────────────────────────────────────────────────────────

function TodoList({ sessionIdx, saved, persist }) {
  const [input, setInput] = useState("");
  const todos = saved[sessionIdx]?.todos || [];

  const updateTodos = (newTodos) => {
    const updated = saved.map((s, i) =>
      i === sessionIdx ? { ...s, todos: newTodos } : s,
    );
    persist(updated);
  };

  const addTodo = () => {
    const val = input.trim();
    if (!val) return;
    updateTodos([...todos, { id: Date.now(), text: val, done: false }]);
    setInput("");
  };

  const toggleTodo = (id) =>
    updateTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const deleteTodo = (id) => updateTodos(todos.filter((t) => t.id !== id));

  const done = todos.filter((t) => t.done).length;

  return (
    <Section
      title={`Follow-up Checklist${todos.length > 0 ? ` · ${done}/${todos.length} done` : ""}`}
      color="#fb923c"
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: todos.length > 0 ? 14 : 0,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a follow-up task..."
          style={{
            flex: 1,
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 6,
            padding: "8px 12px",
            color: "#ccc",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          onClick={addTodo}
          style={{
            background: "#fb923c18",
            border: "1px solid #fb923c44",
            color: "#fb923c",
            borderRadius: 6,
            padding: "8px 14px",
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
          }}
        >
          + Add
        </button>
      </div>

      {todos.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {todos.map((todo) => (
            <div
              key={todo.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: todo.done ? "#0f0f0f" : "#1a1a1a",
                border: `1px solid ${todo.done ? "#1e1e1e" : "#2a2a2a"}`,
                borderRadius: 6,
                padding: "8px 12px",
                transition: "all 0.15s",
              }}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  flexShrink: 0,
                  border: `1.5px solid ${todo.done ? "#fb923c" : "#444"}`,
                  background: todo.done ? "#fb923c" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                {todo.done && (
                  <span
                    style={{ color: "#000", fontSize: 11, fontWeight: 900 }}
                  >
                    ✓
                  </span>
                )}
              </button>
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  color: todo.done ? "#444" : "#ccc",
                  textDecoration: todo.done ? "line-through" : "none",
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#333",
                  cursor: "pointer",
                  fontSize: 16,
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {todos.length === 0 && (
        <p
          style={{
            color: "#333",
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
            margin: "8px 0 0",
          }}
        >
          No tasks yet — add one above.
        </p>
      )}
    </Section>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [session, setSession] = useState(EMPTY_SESSION);
  const [saved, setSaved] = useState([]);
  const [view, setView] = useState("form");
  const [detailIdx, setDetailIdx] = useState(null);
  const [saveFlash, setSaveFlash] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("discovery_sessions") || "[]");
      setSaved(s);
    } catch {}
  }, []);

  const persist = (sessions) => {
    setSaved(sessions);
    localStorage.setItem("discovery_sessions", JSON.stringify(sessions));
  };

  const toggle = (field, val) =>
    setSession((s) => ({
      ...s,
      [field]: s[field].includes(val)
        ? s[field].filter((x) => x !== val)
        : [...s[field], val],
    }));

  const saveSession = () => {
    if (!session.clientName.trim()) return alert("Add a client name first.");
    const updated = [
      {
        ...session,
        todos: [...session.milestones, ...session.customMilestones].map(
          (m, i) => ({ id: Date.now() + i, text: m, done: false }),
        ),
        savedAt: new Date().toISOString(),
      },
      ...saved,
    ];
    persist(updated);
    setSession({
      ...EMPTY_SESSION,
      date: new Date().toISOString().slice(0, 10),
    });
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1800);
    setView("list");
  };

  const deleteSession = (idx) => {
    if (!confirm("Delete this session?")) return;
    persist(saved.filter((_, i) => i !== idx));
    if (view === "detail") setView("list");
  };

  const colors = {
    pain: "#f87171",
    integration: "#60a5fa",
    milestone: "#34d399",
  };

  const summaryCount =
    session.painPoints.length +
    session.customPainPoints.length +
    session.integrations.length +
    session.customIntegrations.length +
    session.milestones.length +
    session.customMilestones.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#e0e0e0",
        fontFamily: "'DM Sans', sans-serif",
        paddingBottom: 60,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        textarea:focus, input:focus { border-color: #444 !important; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #1a1a1a",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "#0a0a0a",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "linear-gradient(135deg, #60a5fa, #34d399)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            ◈
          </div>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              color: "#aaa",
              letterSpacing: "0.05em",
            }}
          >
            discovery tracker
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setView("form")}
            style={{
              background: view === "form" ? "#1e1e1e" : "none",
              border: `1px solid ${view === "form" ? "#333" : "transparent"}`,
              borderRadius: 6,
              padding: "6px 14px",
              color: view === "form" ? "#e0e0e0" : "#555",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.05em",
            }}
          >
            New Call
          </button>
          <button
            onClick={() => setView("list")}
            style={{
              background: view !== "form" ? "#1e1e1e" : "none",
              border: `1px solid ${view !== "form" ? "#333" : "transparent"}`,
              borderRadius: 6,
              padding: "6px 14px",
              color: view !== "form" ? "#e0e0e0" : "#555",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Saved
            {saved.length > 0 && (
              <span
                style={{
                  background: "#333",
                  borderRadius: 10,
                  padding: "1px 7px",
                  fontSize: 10,
                  color: "#888",
                }}
              >
                {saved.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 20px" }}>
        {/* ── FORM VIEW ── */}
        {view === "form" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 180px",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <label
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: "#555",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Client Name
                </label>
                <input
                  value={session.clientName}
                  onChange={(e) =>
                    setSession((s) => ({ ...s, clientName: e.target.value }))
                  }
                  placeholder="Acme Roofing Co."
                  style={{
                    width: "100%",
                    background: "#111",
                    border: "1px solid #222",
                    borderRadius: 6,
                    padding: "10px 14px",
                    color: "#e0e0e0",
                    fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: "#555",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Call Date
                </label>
                <input
                  type="date"
                  value={session.date}
                  onChange={(e) =>
                    setSession((s) => ({ ...s, date: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    background: "#111",
                    border: "1px solid #222",
                    borderRadius: 6,
                    padding: "10px 14px",
                    color: "#e0e0e0",
                    fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "#555",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                HubSpot Ticket URL
              </label>
              <input
                value={session.hsTicketUrl}
                onChange={(e) =>
                  setSession((s) => ({ ...s, hsTicketUrl: e.target.value }))
                }
                placeholder="https://app.hubspot.com/contacts/..."
                style={{
                  width: "100%",
                  background: "#111",
                  border: "1px solid #fb923c33",
                  borderRadius: 6,
                  padding: "10px 14px",
                  color: "#e0e0e0",
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                }}
              />
            </div>

            <Section title="Pain Points / Client Needs" color={colors.pain}>
              <CheckGrid
                items={PAIN_POINTS}
                selected={session.painPoints}
                onToggle={(v) => toggle("painPoints", v)}
                color={colors.pain}
              />
              <CustomTags
                items={session.customPainPoints}
                onAdd={(v) =>
                  setSession((s) => ({
                    ...s,
                    customPainPoints: [...s.customPainPoints, v],
                  }))
                }
                onRemove={(v) =>
                  setSession((s) => ({
                    ...s,
                    customPainPoints: s.customPainPoints.filter((x) => x !== v),
                  }))
                }
                color={colors.pain}
                placeholder="Add custom pain point..."
              />
            </Section>

            <Section
              title="Integration Requirements"
              color={colors.integration}
            >
              <CheckGrid
                items={INTEGRATIONS}
                selected={session.integrations}
                onToggle={(v) => toggle("integrations", v)}
                color={colors.integration}
              />
              <CustomTags
                items={session.customIntegrations}
                onAdd={(v) =>
                  setSession((s) => ({
                    ...s,
                    customIntegrations: [...s.customIntegrations, v],
                  }))
                }
                onRemove={(v) =>
                  setSession((s) => ({
                    ...s,
                    customIntegrations: s.customIntegrations.filter(
                      (x) => x !== v,
                    ),
                  }))
                }
                color={colors.integration}
                placeholder="Add custom integration..."
              />
            </Section>

            <Section title="Timeline & Milestones" color={colors.milestone}>
              <div
                style={{
                  marginBottom: 16,
                  background: `${colors.milestone}10`,
                  border: `1px solid ${colors.milestone}33`,
                  borderRadius: 8,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      color: "#555",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Implementation Deadline
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 15,
                      color: colors.milestone,
                      fontWeight: 600,
                    }}
                  >
                    {(() => {
                      const d = new Date(session.date);
                      d.setDate(d.getDate() + 30);
                      return d.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });
                    })()}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    color: "#555",
                    textAlign: "right",
                  }}
                >
                  30 days from
                  <br />
                  call date
                </div>
              </div>
              <label
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "#555",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Key Milestones
              </label>
              <CheckGrid
                items={MILESTONES}
                selected={session.milestones}
                onToggle={(v) => toggle("milestones", v)}
                color={colors.milestone}
              />
              <CustomTags
                items={session.customMilestones}
                onAdd={(v) =>
                  setSession((s) => ({
                    ...s,
                    customMilestones: [...s.customMilestones, v],
                  }))
                }
                onRemove={(v) =>
                  setSession((s) => ({
                    ...s,
                    customMilestones: s.customMilestones.filter((x) => x !== v),
                  }))
                }
                color={colors.milestone}
                placeholder="Add custom milestone..."
              />
            </Section>

            <Section title="Notes" color="#888">
              <textarea
                value={session.notes}
                onChange={(e) =>
                  setSession((s) => ({ ...s, notes: e.target.value }))
                }
                placeholder="Additional context, objections, follow-ups..."
                rows={4}
                style={{
                  width: "100%",
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 6,
                  padding: "10px 12px",
                  color: "#ccc",
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </Section>

            <div
              style={{
                borderTop: "1px solid #1a1a1a",
                paddingTop: 20,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "#444",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Quick Links
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {QUICK_LINKS.map(({ label, url, color }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: `${color}12`,
                      border: `1px solid ${color}33`,
                      borderRadius: 7,
                      padding: "8px 16px",
                      color,
                      fontSize: 12,
                      fontFamily: "'DM Mono', monospace",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = `${color}22`)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = `${color}12`)
                    }
                  >
                    ↗ {label}
                  </a>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#444",
                }}
              >
                {summaryCount} item{summaryCount !== 1 ? "s" : ""} selected
              </span>
              <button
                onClick={saveSession}
                style={{
                  background: saveFlash ? "#22c55e22" : "#60a5fa22",
                  border: `1px solid ${saveFlash ? "#22c55e" : "#60a5fa"}`,
                  borderRadius: 8,
                  padding: "10px 28px",
                  color: saveFlash ? "#22c55e" : "#60a5fa",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {saveFlash ? "✓ Saved" : "Save Session"}
              </button>
            </div>
          </>
        )}

        {/* ── SAVED LIST VIEW ── */}
        {view === "list" && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#444",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Saved Sessions
              </div>
              {saved.length > 0 && (
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search clients..."
                  style={{
                    background: "#111",
                    border: "1px solid #222",
                    borderRadius: 6,
                    padding: "6px 12px",
                    color: "#ccc",
                    fontSize: 12,
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none",
                    width: 200,
                  }}
                />
              )}
            </div>
            {saved.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "#333",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                }}
              >
                No sessions saved yet.
                <br />
                <button
                  onClick={() => setView("form")}
                  style={{
                    marginTop: 12,
                    background: "none",
                    border: "1px solid #2a2a2a",
                    borderRadius: 6,
                    padding: "8px 18px",
                    color: "#555",
                    cursor: "pointer",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                  }}
                >
                  Start a call →
                </button>
              </div>
            ) : (
              <>
                {(() => {
                  const filtered = saved.filter((s) =>
                    s.clientName.toLowerCase().includes(search.toLowerCase()),
                  );
                  if (filtered.length === 0)
                    return (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px 0",
                          color: "#333",
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 13,
                        }}
                      >
                        No matches for "{search}"
                      </div>
                    );
                  return filtered.map((s) => {
                    const i = saved.indexOf(s);
                    const total =
                      s.painPoints.length +
                      s.customPainPoints.length +
                      s.integrations.length +
                      s.customIntegrations.length +
                      s.milestones.length +
                      s.customMilestones.length;
                    const doneTodos = (s.todos || []).filter(
                      (t) => t.done,
                    ).length;
                    const totalTodos = (s.todos || []).length;
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          setDetailIdx(i);
                          setView("detail");
                        }}
                        style={{
                          background: "#111",
                          border: "1px solid #1e1e1e",
                          borderRadius: 8,
                          padding: "14px 18px",
                          marginBottom: 10,
                          cursor: "pointer",
                          transition: "border-color 0.15s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.borderColor = "#333")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor = "#1e1e1e")
                        }
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 600,
                              color: "#e0e0e0",
                              marginBottom: 4,
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            {s.clientName}
                            {s.hsTicketUrl && (
                              <a
                                href={s.hsTicketUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  background: "#fb923c18",
                                  border: "1px solid #fb923c44",
                                  borderRadius: 20,
                                  padding: "1px 10px",
                                  color: "#fb923c",
                                  fontSize: 11,
                                  fontFamily: "'DM Mono', monospace",
                                  textDecoration: "none",
                                }}
                              >
                                ↗ HS Ticket
                              </a>
                            )}
                          </div>
                          <div
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: 11,
                              color: "#444",
                            }}
                          >
                            {s.date} · {total} item{total !== 1 ? "s" : ""}
                            {s.timeline ? ` · ${s.timeline}` : ""}
                            {totalTodos > 0
                              ? ` · ✓ ${doneTodos}/${totalTodos} tasks`
                              : ""}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(i);
                          }}
                          style={{
                            background: "none",
                            border: "1px solid #2a2a2a",
                            borderRadius: 6,
                            padding: "4px 10px",
                            color: "#555",
                            cursor: "pointer",
                            fontSize: 12,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    );
                  });
                })()}
              </>
            )}
          </>
        )}

        {/* ── DETAIL VIEW ── */}
        {view === "detail" &&
          detailIdx !== null &&
          (() => {
            const s = saved[detailIdx];
            if (!s) return null;
            const Tag = ({ label, color }) => (
              <span
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}33`,
                  borderRadius: 20,
                  padding: "3px 11px",
                  color: "#bbb",
                  fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {label}
              </span>
            );
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <button
                      onClick={() => setView("list")}
                      style={{
                        background: "none",
                        border: "1px solid #2a2a2a",
                        borderRadius: 6,
                        padding: "6px 12px",
                        color: "#555",
                        cursor: "pointer",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 11,
                      }}
                    >
                      ← Back
                    </button>
                    <div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          color: "#e0e0e0",
                        }}
                      >
                        {s.clientName}
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 11,
                          color: "#444",
                        }}
                      >
                        {s.date}
                      </div>
                    </div>
                  </div>
                  {s.hsTicketUrl && (
                    <a
                      href={s.hsTicketUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: "#fb923c18",
                        border: "1px solid #fb923c55",
                        borderRadius: 7,
                        padding: "8px 18px",
                        color: "#fb923c",
                        fontSize: 12,
                        fontFamily: "'DM Mono', monospace",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#fb923c28")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#fb923c18")
                      }
                    >
                      ↗ HubSpot Ticket
                    </a>
                  )}
                </div>

                {/* Checklist is the first thing you see when you reopen a session */}
                <TodoList
                  sessionIdx={detailIdx}
                  saved={saved}
                  persist={persist}
                />

                {[...s.painPoints, ...s.customPainPoints].length > 0 && (
                  <Section title="Pain Points / Needs" color={colors.pain}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[...s.painPoints, ...s.customPainPoints].map((p) => (
                        <Tag key={p} label={p} color={colors.pain} />
                      ))}
                    </div>
                  </Section>
                )}
                {[...s.integrations, ...s.customIntegrations].length > 0 && (
                  <Section
                    title="Integration Requirements"
                    color={colors.integration}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[...s.integrations, ...s.customIntegrations].map((p) => (
                        <Tag key={p} label={p} color={colors.integration} />
                      ))}
                    </div>
                  </Section>
                )}
                {[...s.milestones, ...s.customMilestones].length > 0 && (
                  <Section title="Milestones" color={colors.milestone}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[...s.milestones, ...s.customMilestones].map((p) => (
                        <Tag key={p} label={p} color={colors.milestone} />
                      ))}
                    </div>
                    <div
                      style={{
                        marginTop: 12,
                        background: `${colors.milestone}10`,
                        border: `1px solid ${colors.milestone}33`,
                        borderRadius: 8,
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 10,
                            color: "#555",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: 3,
                          }}
                        >
                          Implementation Deadline
                        </div>
                        <div
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 14,
                            color: colors.milestone,
                            fontWeight: 600,
                          }}
                        >
                          {(() => {
                            const d = new Date(s.date);
                            d.setDate(d.getDate() + 30);
                            return d.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            });
                          })()}
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 10,
                          color: "#555",
                          textAlign: "right",
                        }}
                      >
                        30 days
                        <br />
                        from call
                      </div>
                    </div>
                  </Section>
                )}
                {s.notes && (
                  <Section title="Discovery Notes" color="#888">
                    <p
                      style={{
                        color: "#aaa",
                        fontSize: 14,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {s.notes}
                    </p>
                  </Section>
                )}

                <Section title="Granola AI Call Notes" color="#4ade80">
                  <textarea
                    value={s.granolaNotes || ""}
                    onChange={(e) => {
                      const updated = saved.map((item, i) =>
                        i === detailIdx
                          ? { ...item, granolaNotes: e.target.value }
                          : item,
                      );
                      persist(updated);
                    }}
                    placeholder="Paste your Granola AI notes here..."
                    rows={10}
                    style={{
                      width: "100%",
                      background: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      borderRadius: 6,
                      padding: "10px 12px",
                      color: "#ccc",
                      fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif",
                      outline: "none",
                      resize: "vertical",
                      lineHeight: 1.7,
                    }}
                  />
                  {s.granolaNotes && (
                    <div
                      style={{
                        marginTop: 8,
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        color: "#333",
                      }}
                    >
                      {s.granolaNotes.trim().split(/\s+/).length} words ·
                      auto-saved
                    </div>
                  )}
                </Section>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 8,
                  }}
                >
                  <button
                    onClick={() => deleteSession(detailIdx)}
                    style={{
                      background: "none",
                      border: "1px solid #3a1a1a",
                      borderRadius: 6,
                      padding: "7px 16px",
                      color: "#7a3333",
                      cursor: "pointer",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                    }}
                  >
                    Delete Session
                  </button>
                </div>
              </>
            );
          })()}
      </div>
    </div>
  );
}
