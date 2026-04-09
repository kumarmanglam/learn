import CodeRunner from "./CodeRunner";
import PythonBlock from "./PythonBlock";

const SIZE_LABELS = { small: "S", medium: "M", large: "L" };
const SIZE_COLORS = { small: "#7ee787", medium: "#f0883e", large: "#d2a8ff" };

export default function ExamplesTab({ topic }) {
  const examples = topic.examples || [];

  if (examples.length === 0) {
    return (
      <div style={{ maxWidth: 800, color: "#8b949e", padding: "40px 0", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>💻</div>
        <div>No code examples for this topic yet.</div>
      </div>
    );
  }

  // Determine if a topic is Python-first:
  // - explicit language: "python" on any example, OR
  // - topic category is not "JavaScript" / "React"
  const jsCategories = new Set(["JavaScript", "React"]);
  const topicIsJS = jsCategories.has(topic.category);

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <h2 style={{ color: "#e6edf3", fontSize: 20, margin: 0 }}>💻 Code Examples</h2>
        <div style={{ display: "flex", gap: 6 }}>
          {Object.entries(SIZE_LABELS).map(([size, label]) => {
            const count = examples.filter(e => e.size === size).length;
            if (!count) return null;
            return (
              <span key={size} style={{ fontSize: 10, color: SIZE_COLORS[size], background: `${SIZE_COLORS[size]}18`, padding: "2px 7px", borderRadius: 10 }}>
                {label}: {count}
              </span>
            );
          })}
        </div>
      </div>
      <p style={{ color: "#8b949e", fontSize: 13, marginBottom: 20 }}>
        {topicIsJS
          ? "Click ▶ Execute to run JavaScript examples in-browser."
          : "Python examples — run locally or in Google Colab. Show ▼ to reveal expected output."}
      </p>

      {examples.map((ex, i) => {
        const isPython = ex.language === "python" || (!topicIsJS && ex.language !== "javascript");

        return (
          <div key={i} style={{ marginBottom: 30 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <span style={{ color: "#8b949e", fontSize: 12 }}>#{i + 1}</span>
              <h3 style={{ color: "#58a6ff", fontSize: 15, margin: 0, fontWeight: 600 }}>{ex.title}</h3>
              {ex.size && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  color: SIZE_COLORS[ex.size] || "#8b949e",
                  background: `${(SIZE_COLORS[ex.size] || "#8b949e")}18`,
                  padding: "1px 6px", borderRadius: 4,
                }}>
                  {ex.size?.toUpperCase()}
                </span>
              )}
            </div>

            {isPython ? (
              <PythonBlock example={ex} />
            ) : (
              <>
                {ex.description && (
                  <p style={{ color: "#8b949e", fontSize: 12, marginBottom: 6, lineHeight: 1.5 }}>{ex.description}</p>
                )}
                <CodeRunner code={ex.code} title={ex.title} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
