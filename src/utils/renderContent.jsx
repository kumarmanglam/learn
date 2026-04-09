// ─── Inline renderer: backtick code + **bold** ───
export const renderInline = (text) => {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={i} style={{ background: "#1c2333", padding: "2px 6px", borderRadius: 4, fontSize: 12.5, color: "#79c0ff", fontFamily: "'JetBrains Mono', monospace" }}>
          {part.slice(1, -1)}
        </code>
      );
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} style={{ color: "#e6edf3", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    return part;
  });
};

// ─── Block renderer: parse markdown-like content into React elements ───
export const renderContent = (text) => {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Fenced code block  ```lang ... ``` ──
    if (line.trimStart().startsWith("```")) {
      const codeLines = [];
      const lang = line.trim().slice(3).trim() || "text";
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} style={{
          background: "#0d1117", border: "1px solid #21262d", borderRadius: 8,
          padding: "12px 14px", margin: "10px 0",
          fontSize: 12.5, lineHeight: 1.65,
          fontFamily: "'JetBrains Mono', monospace",
          overflowX: "auto", whiteSpace: "pre-wrap", color: "#e6edf3",
        }}>
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      i++;
      continue;
    }

    // ── Headings ──
    if (line.startsWith("#### ")) {
      elements.push(<h4 key={i} style={{ color: "#d2a8ff", fontSize: 13, fontWeight: 600, marginTop: 14, marginBottom: 4 }}>{renderInline(line.slice(5))}</h4>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} style={{ color: "#58a6ff", fontSize: 16, fontWeight: 600, marginTop: 18, marginBottom: 6 }}>{renderInline(line.slice(4))}</h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} style={{ color: "#e6edf3", fontSize: 20, fontWeight: 700, marginTop: 22, marginBottom: 10, borderBottom: "1px solid #21262d", paddingBottom: 8 }}>{renderInline(line.slice(3))}</h2>);
    } else if (line.startsWith("# ")) {
      elements.push(<h1 key={i} style={{ color: "#e6edf3", fontSize: 24, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{renderInline(line.slice(2))}</h1>);

    // ── Horizontal rule ──
    } else if (line.trim() === "---" || line.trim() === "***") {
      elements.push(<hr key={i} style={{ border: "none", borderTop: "1px solid #21262d", margin: "16px 0" }} />);

    // ── Bullet list ──
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={i} style={{ paddingLeft: 16, marginBottom: 4, color: "#c9d1d9", fontSize: 14, lineHeight: 1.65, display: "flex", gap: 6 }}>
          <span style={{ color: "#58a6ff", flexShrink: 0 }}>•</span>
          <span>{renderInline(line.slice(2))}</span>
        </div>
      );

    // ── Numbered list ──
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <div key={i} style={{ paddingLeft: 16, marginBottom: 4, color: "#c9d1d9", fontSize: 14, lineHeight: 1.65 }}>
          {renderInline(line)}
        </div>
      );

    // ── Markdown table (| col | col | ...) ──
    } else if (line.startsWith("|")) {
      // Collect all consecutive table lines
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      // Parse header, separator, rows
      const headerCells = tableLines[0].split("|").filter(c => c.trim() !== "");
      const bodyRows = tableLines.slice(2).map(l => l.split("|").filter(c => c.trim() !== ""));
      elements.push(
        <div key={`table-${i}`} style={{ overflowX: "auto", margin: "12px 0", borderRadius: 8, border: "1px solid #21262d" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {headerCells.map((cell, ci) => (
                  <th key={ci} style={{ padding: "8px 12px", background: "#161b22", color: "#58a6ff", borderBottom: "2px solid #21262d", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {cell.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? "#0d1117" : "#0b0f14" }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: "7px 12px", color: "#c9d1d9", borderBottom: "1px solid #21262d", fontSize: 12 }}>
                      {renderInline(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue; // already advanced i

    // ── Blockquote ──
    } else if (line.startsWith("> ")) {
      elements.push(
        <div key={i} style={{ borderLeft: "3px solid #1f6feb", paddingLeft: 12, margin: "8px 0", color: "#8b949e", fontSize: 13, fontStyle: "italic", lineHeight: 1.65 }}>
          {renderInline(line.slice(2))}
        </div>
      );

    // ── Blank line ──
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: 8 }} />);

    // ── Regular paragraph ──
    } else {
      elements.push(
        <p key={i} style={{ color: "#c9d1d9", fontSize: 14, lineHeight: 1.75, marginBottom: 6, marginTop: 0 }}>
          {renderInline(line)}
        </p>
      );
    }

    i++;
  }

  return elements;
};
