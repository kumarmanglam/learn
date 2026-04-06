// Render markdown-like content
export const renderInline = (text) => {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i} style={{ background: "#1c2333", padding: "2px 6px", borderRadius: 4, fontSize: 13, color: "#79c0ff", fontFamily: "'JetBrains Mono', monospace" }}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} style={{ color: "#e6edf3", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    return part;
  });
};

export const renderContent = (text) => {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} style={{ color: "#e6edf3", fontSize: 20, fontWeight: 700, marginTop: 20, marginBottom: 10, borderBottom: "1px solid #21262d", paddingBottom: 8 }}>{line.replace("## ", "")}</h2>;
    if (line.startsWith("### ")) return <h3 key={i} style={{ color: "#58a6ff", fontSize: 16, fontWeight: 600, marginTop: 16, marginBottom: 6 }}>{line.replace("### ", "")}</h3>;
    if (line.startsWith("- ")) return <div key={i} style={{ paddingLeft: 16, marginBottom: 4, color: "#c9d1d9", fontSize: 14, lineHeight: 1.6 }}>• {renderInline(line.slice(2))}</div>;
    if (/^\d+\.\s/.test(line)) return <div key={i} style={{ paddingLeft: 16, marginBottom: 4, color: "#c9d1d9", fontSize: 14, lineHeight: 1.6 }}>{renderInline(line)}</div>;
    if (line.startsWith("|")) return null; // skip table rows (handled manually)
    if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
    if (line.startsWith("```")) return null;
    return <p key={i} style={{ color: "#c9d1d9", fontSize: 14, lineHeight: 1.7, marginBottom: 6 }}>{renderInline(line)}</p>;
  });
};
