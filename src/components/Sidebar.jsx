import { TOPICS, CATEGORIES } from "../data/topics";

export default function Sidebar({
  sidebarOpen, searchQuery, setSearchQuery, groupedTopics,
  activeTopic, setActiveTopic, setActiveTab,
  completedTopics, toggleComplete, progress,
}) {
  return (
    <div style={{ width: sidebarOpen ? 300 : 0, minWidth: sidebarOpen ? 300 : 0, background: "#0d1117", borderRight: "1px solid #21262d", display: "flex", flexDirection: "column", transition: "all 0.2s", overflow: "hidden" }}>
      <div style={{ padding: "16px 14px 10px", borderBottom: "1px solid #21262d" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>🧠</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3" }}>Interview Mastery</div>
            <div style={{ fontSize: 11, color: "#8b949e" }}>{TOPICS.length} topics • {completedTopics.size} completed</div>
          </div>
        </div>
        <div style={{ background: "#161b22", borderRadius: 6, height: 6, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ width: progress + "%", height: "100%", background: progress === 100 ? "#238636" : "#1f6feb", borderRadius: 6, transition: "width 0.3s" }} />
        </div>
        <input
          type="text"
          placeholder="Search topics..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: "100%", padding: "8px 10px", background: "#161b22", border: "1px solid #30363d", borderRadius: 6, color: "#e6edf3", fontSize: 13, outline: "none", boxSizing: "border-box" }}
        />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {Object.entries(groupedTopics).map(([cat, topics]) => {
          const catInfo = CATEGORIES[cat] || { color: "#8b949e", icon: "📁" };
          return (
            <div key={cat} style={{ marginBottom: 4 }}>
              <div style={{ padding: "6px 14px", fontSize: 11, fontWeight: 700, color: catInfo.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {catInfo.icon} {cat}
              </div>
              {topics.map(t => (
                <div
                  key={t.id}
                  onClick={() => { setActiveTopic(t.id); setActiveTab("learn"); }}
                  style={{
                    padding: "8px 14px 8px 24px",
                    cursor: "pointer",
                    background: activeTopic === t.id ? "#1c2333" : "transparent",
                    borderLeft: activeTopic === t.id ? "2px solid " + catInfo.color : "2px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.1s",
                  }}
                >
                  <span
                    onClick={(e) => { e.stopPropagation(); toggleComplete(t.id); }}
                    style={{ fontSize: 14, cursor: "pointer", opacity: completedTopics.has(t.id) ? 1 : 0.4 }}
                  >
                    {completedTopics.has(t.id) ? "✅" : "⬜"}
                  </span>
                  <span style={{ fontSize: 13, color: activeTopic === t.id ? "#e6edf3" : "#8b949e", flex: 1 }}>{t.title}</span>
                  {t.priority === "High" && <span style={{ fontSize: 9, color: "#f85149", background: "#f8514920", padding: "1px 5px", borderRadius: 4 }}>HIGH</span>}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
