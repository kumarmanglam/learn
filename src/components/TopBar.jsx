import { CATEGORIES } from "../data/topics";

const TABS = [
  { id: "learn",      label: "📖 Learn" },
  { id: "examples",   label: "💻 Code" },
  { id: "quiz",       label: "🧪 Quiz" },
  { id: "flashcards", label: "🃏 Cards" },
];

export default function TopBar({ sidebarOpen, setSidebarOpen, topic, activeTab, setActiveTab }) {
  return (
    <div style={{
      padding: "10px 20px",
      borderBottom: "1px solid #21262d",
      display: "flex", alignItems: "center", gap: 12,
      background: "#0d1117", flexWrap: "wrap",
    }}>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ background: "none", border: "1px solid #30363d", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#8b949e", fontSize: 16, flexShrink: 0 }}
      >
        {sidebarOpen ? "◀" : "▶"}
      </button>

      {topic && (
        <>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{topic.icon}</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#e6edf3", whiteSpace: "nowrap" }}>{topic.title}</span>
          <span style={{
            fontSize: 11,
            color: CATEGORIES[topic.category]?.color || "#8b949e",
            background: CATEGORIES[topic.category]?.bg || "#21262d",
            padding: "2px 8px", borderRadius: 10, whiteSpace: "nowrap",
          }}>
            {topic.category}
          </span>
          {topic.estimatedMinutes && (
            <span style={{ fontSize: 11, color: "#8b949e", whiteSpace: "nowrap" }}>
              ⏱ {topic.estimatedMinutes}m
            </span>
          )}

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", gap: 2, background: "#161b22", borderRadius: 8, padding: 2, flexShrink: 0 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  background: activeTab === tab.id ? "#1f6feb" : "transparent",
                  color: activeTab === tab.id ? "#fff" : "#8b949e",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
