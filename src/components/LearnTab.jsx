import { renderContent } from "../utils/renderContent";
import Diagram from "./Diagram";

// ─── Reusable section box ───
const Box = ({ color, bg, border, icon, title, children, mt = 20 }) => (
  <div style={{ marginTop: mt, padding: 16, background: bg, border: `1px solid ${border}`, borderRadius: 10 }}>
    <div style={{ color, fontWeight: 700, marginBottom: 10, fontSize: 14 }}>{icon} {title}</div>
    {children}
  </div>
);

// ─── Comparison table ───
const ComparisonTable = ({ table }) => {
  if (!table) return null;
  return (
    <div style={{ marginTop: 22 }}>
      <h3 style={{ color: "#58a6ff", fontSize: 15, fontWeight: 600, marginBottom: 10 }}>⚖️ {table.title}</h3>
      <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #21262d" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {table.columns.map((col, i) => (
                <th key={i} style={{
                  padding: "9px 14px", background: "#161b22",
                  color: "#58a6ff", borderBottom: "2px solid #21262d",
                  textAlign: "left", fontWeight: 600, whiteSpace: "nowrap",
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#0d1117" : "#0b0f14" }}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: "8px 14px",
                    color: j === 0 ? "#e6edf3" : "#c9d1d9",
                    borderBottom: "1px solid #21262d",
                    fontSize: j === 0 ? 13 : 12,
                    fontWeight: j === 0 ? 600 : 400,
                  }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Further reading item ───
const ReadingItem = ({ r }) => {
  const icons = { paper: "📄", video: "🎥", blog: "✍️", docs: "📖", book: "📕", course: "🎓" };
  return (
    <div style={{ padding: "10px 14px", background: "#161b22", border: "1px solid #21262d", borderRadius: 8, marginBottom: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{icons[r.type] || "🔗"}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: "#e6edf3", fontSize: 13, fontWeight: 600 }}>{r.title}</div>
        {r.authors && (
          <div style={{ color: "#8b949e", fontSize: 11, marginTop: 2 }}>
            {r.authors}{r.year ? ` · ${r.year}` : ""}
          </div>
        )}
        {r.whyRead && (
          <div style={{ color: "#c9d1d9", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{r.whyRead}</div>
        )}
        {r.url && (
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#58a6ff", fontSize: 11, marginTop: 4, display: "inline-block", wordBreak: "break-all" }}
          >
            {r.url}
          </a>
        )}
      </div>
    </div>
  );
};

export default function LearnTab({ topic }) {
  return (
    <div style={{ maxWidth: 820 }}>
      {/* Meta row: time + prerequisites */}
      {(topic.estimatedMinutes || topic.prerequisites?.length > 0 || topic.nextTopics?.length > 0) && (
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
          {topic.estimatedMinutes && (
            <span style={{ fontSize: 12, color: "#8b949e", background: "#161b22", padding: "3px 10px", borderRadius: 12, border: "1px solid #21262d" }}>
              ⏱ {topic.estimatedMinutes} min
            </span>
          )}
          {topic.prerequisites?.map(p => (
            <span key={p} style={{ fontSize: 11, color: "#58a6ff", background: "#1f6feb10", padding: "3px 9px", borderRadius: 12, border: "1px solid #1f6feb25" }}>
              prereq: {p}
            </span>
          ))}
          {topic.nextTopics?.map(n => (
            <span key={n} style={{ fontSize: 11, color: "#7ee787", background: "#23863610", padding: "3px 9px", borderRadius: 12, border: "1px solid #23863625" }}>
              next: {n}
            </span>
          ))}
        </div>
      )}

      {/* Why It Matters */}
      {topic.whyItMatters && (
        <Box color="#f0883e" bg="#f0883e08" border="#f0883e30" icon="🎯" title="Why It Matters" mt={0}>
          <p style={{ color: "#c9d1d9", fontSize: 14, lineHeight: 1.75, margin: 0 }}>{topic.whyItMatters}</p>
        </Box>
      )}

      {/* Analogy */}
      {topic.analogy && (
        <Box color="#d2a8ff" bg="#d2a8ff07" border="#d2a8ff25" icon="💡" title="The Analogy">
          <p style={{ color: "#c9d1d9", fontSize: 14, lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>{topic.analogy}</p>
        </Box>
      )}

      {/* Main content (markdown-like) */}
      <div style={{ marginTop: 20 }}>
        {renderContent(topic.content)}
      </div>

      {/* Diagrams — new schema (array) */}
      {topic.diagrams?.map((diagram, i) => (
        <Diagram key={i} diagram={diagram} />
      ))}

      {/* Single diagram — old schema backward compat */}
      {topic.diagram && !topic.diagrams && (
        <div style={{ margin: "20px 0" }}>
          <h3 style={{ color: "#58a6ff", fontSize: 15, marginBottom: 10 }}>📊 Visual Diagram</h3>
          <Diagram svg={topic.diagram} />
        </div>
      )}

      {/* Comparison table */}
      {topic.comparisonTable && <ComparisonTable table={topic.comparisonTable} />}

      {/* Common Mistakes */}
      {topic.commonMistakes?.length > 0 && (
        <div style={{ marginTop: 26 }}>
          <h3 style={{ color: "#f85149", fontSize: 15, fontWeight: 600, marginBottom: 12 }}>⚠️ Common Mistakes</h3>
          {topic.commonMistakes.map((m, i) => (
            <div key={i} style={{ marginBottom: 10, padding: "12px 14px", background: "#f8514908", border: "1px solid #f8514928", borderRadius: 8 }}>
              <div style={{ color: "#f85149", fontWeight: 600, fontSize: 13, marginBottom: 5 }}>❌ {m.mistake}</div>
              <div style={{ color: "#8b949e", fontSize: 12, marginBottom: 4, lineHeight: 1.5 }}>
                <strong style={{ color: "#c9d1d9" }}>Why it happens: </strong>{m.whyItHappens}
              </div>
              <div style={{ color: "#8b949e", fontSize: 12, lineHeight: 1.5 }}>
                <strong style={{ color: "#7ee787" }}>Fix: </strong>{m.howToAvoid}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cheat Sheet */}
      {topic.cheatSheet && (
        <Box color="#7ee787" bg="#0d1117" border="#21262d" icon="📋" title="Cheat Sheet">
          {renderContent(topic.cheatSheet)}
        </Box>
      )}

      {/* Further Reading */}
      {topic.furtherReading?.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <h3 style={{ color: "#58a6ff", fontSize: 15, fontWeight: 600, marginBottom: 10 }}>📚 Further Reading</h3>
          {topic.furtherReading.map((r, i) => <ReadingItem key={i} r={r} />)}
        </div>
      )}

      {/* CTA */}
      <div style={{ marginTop: 22, padding: 14, background: "#12261e", border: "1px solid #238636", borderRadius: 10 }}>
        <div style={{ color: "#7ee787", fontWeight: 700, marginBottom: 5 }}>✅ Ready to practice?</div>
        <div style={{ color: "#8b949e", fontSize: 13 }}>
          Switch to <strong style={{ color: "#58a6ff" }}>Code</strong> for Python examples,{" "}
          <strong style={{ color: "#58a6ff" }}>Quiz</strong> to test your knowledge, or{" "}
          <strong style={{ color: "#58a6ff" }}>Cards</strong> for spaced repetition.
        </div>
      </div>
    </div>
  );
}
