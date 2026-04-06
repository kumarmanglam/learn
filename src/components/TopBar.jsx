import { CATEGORIES } from "../data/topics";

export default function TopBar({ sidebarOpen, setSidebarOpen, topic, activeTab, setActiveTab }) {
  return (
    <div style={{ padding: "10px 20px", borderBottom: "1px solid #21262d", display: "flex", alignItems: "center", gap: 12, background: "#0d1117" }}>
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "1px solid #30363d", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#8b949e", fontSize: 16 }}>
        {sidebarOpen ? "◀" : "▶"}
      </button>
      {topic && (
        <>
          <span style={{ fontSize: 20 }}>{topic.icon}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3" }}>{topic.title}</span>
          <span style={{ fontSize: 12, color: CATEGORIES[topic.category]?.color, background: CATEGORIES[topic.category]?.bg, padding: "2px 8px", borderRadius: 10 }}>{topic.category}</span>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 2, background: "#161b22", borderRadius: 8, padding: 2 }}>
            {["learn", "examples", "quiz"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  background: activeTab === tab ? "#1f6feb" : "transparent",
                  color: activeTab === tab ? "#fff" : "#8b949e",
                }}
              >
                {tab === "learn" ? "📖 Learn" : tab === "examples" ? "💻 Code" : "🧪 Quiz"}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
