import { useState, useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// ─── Executable Code Runner ───
const CodeRunner = ({ code, title }) => {
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const run = () => {
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      const logs = [];
      const fakeConsole = {
        log: (...args) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
        error: (...args) => logs.push("❌ " + args.join(" ")),
        warn: (...args) => logs.push("⚠️ " + args.join(" ")),
      };
      try {
        const fn = new Function("console", code);
        fn(fakeConsole);
        if (logs.length === 0) logs.push("✅ Executed successfully (no output)");
      } catch (e) {
        logs.push("❌ Error: " + e.message);
      }
      setOutput(logs);
      setRunning(false);
    }, 300);
  };

  return (
    <div style={{ margin: "16px 0", background: "#0d1117", borderRadius: 10, overflow: "hidden", border: "1px solid #21262d" }}>
      {title && <div style={{ padding: "8px 14px", background: "#161b22", color: "#8b949e", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", borderBottom: "1px solid #21262d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{title}</span>
      </div>}
      <pre style={{ padding: "14px", margin: 0, background: "#0d1117", fontSize: 13, lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace", overflowX: "auto", whiteSpace: "pre-wrap" }}>
        <code ref={codeRef} className="language-javascript">{code}</code>
      </pre>
      <div style={{ padding: "8px 14px", borderTop: "1px solid #21262d", display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={run} disabled={running} style={{ background: running ? "#1f6feb55" : "#1f6feb", color: "#fff", border: "none", borderRadius: 6, padding: "6px 16px", cursor: running ? "default" : "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          {running ? "⏳ Running..." : "▶ Execute"}
        </button>
        {output && <button onClick={() => setOutput(null)} style={{ background: "transparent", color: "#8b949e", border: "1px solid #30363d", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>Clear</button>}
      </div>
      {output && (
        <div style={{ padding: "12px 14px", background: "#0a0e14", borderTop: "1px solid #21262d", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#7ee787" }}>
          <div style={{ color: "#8b949e", fontSize: 11, marginBottom: 6 }}>OUTPUT:</div>
          {output.map((l, i) => <div key={i} style={{ marginBottom: 3, color: l.startsWith("❌") ? "#f85149" : l.startsWith("⚠") ? "#d29922" : "#7ee787" }}>{l}</div>)}
        </div>
      )}
    </div>
  );
};

export default CodeRunner;
