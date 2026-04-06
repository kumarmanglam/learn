import { TOPICS, CATEGORIES } from "../data/topics";

export default function WelcomeScreen() {
  return (
    <div style={{ textAlign: "center", paddingTop: 80 }}>
      <div style={{ fontSize: 50, marginBottom: 16 }}>🧠</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#e6edf3", marginBottom: 8 }}>Interview Mastery Hub</h1>
      <p style={{ color: "#8b949e", fontSize: 15, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
        {TOPICS.length} topics across {Object.keys(CATEGORIES).length} categories. Each topic includes deep explanations, visual diagrams, executable code examples, and practice quizzes.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
        {Object.entries(CATEGORIES).map(([name, info]) => (
          <div key={name} style={{ background: info.bg, border: "1px solid " + info.color + "30", borderRadius: 8, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span>{info.icon}</span>
            <span style={{ color: info.color, fontSize: 13, fontWeight: 600 }}>{name}</span>
            <span style={{ color: "#8b949e", fontSize: 12 }}>({TOPICS.filter(t => t.category === name).length})</span>
          </div>
        ))}
      </div>
      <p style={{ color: "#58a6ff", fontSize: 13, marginTop: 24 }}>← Select a topic from the sidebar to begin</p>
    </div>
  );
}
