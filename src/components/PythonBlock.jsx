import { useState, useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";

const PythonBlock = ({ example }) => {
  const [copied, setCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [example.code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(example.code);
    } catch {
      const el = document.createElement("textarea");
      el.value = example.code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lang = example.language || "python";

  return (
    <div style={{ margin: "12px 0", background: "#0d1117", borderRadius: 10, overflow: "hidden", border: "1px solid #21262d" }}>
      {/* Header row */}
      <div style={{ padding: "7px 14px", background: "#161b22", borderBottom: "1px solid #21262d", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, background: "#3a5f8a", color: "#a5d6ff", padding: "1px 7px", borderRadius: 4, fontWeight: 700, textTransform: "uppercase" }}>
            {lang}
          </span>
          {example.pipInstall && (
            <code style={{ fontSize: 11, color: "#8b949e", fontFamily: "'JetBrains Mono', monospace", background: "#0d1117", padding: "1px 6px", borderRadius: 3 }}>
              pip install {example.pipInstall}
            </code>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {example.requiresApiKey && (
            <span style={{ fontSize: 10, background: "#f0883e20", color: "#f0883e", padding: "1px 7px", borderRadius: 4, whiteSpace: "nowrap" }}>
              🔑 API Key
            </span>
          )}
          {example.requiresGpu && (
            <span style={{ fontSize: 10, background: "#d2a8ff20", color: "#d2a8ff", padding: "1px 7px", borderRadius: 4, whiteSpace: "nowrap" }}>
              🖥 GPU
            </span>
          )}
        </div>
      </div>

      {/* Description & learning goal */}
      {(example.description || example.learningGoal) && (
        <div style={{ padding: "8px 14px", borderBottom: "1px solid #21262d", background: "#0b0f14" }}>
          {example.description && (
            <p style={{ margin: 0, color: "#8b949e", fontSize: 12, lineHeight: 1.55 }}>{example.description}</p>
          )}
          {example.learningGoal && (
            <p style={{ margin: example.description ? "4px 0 0" : 0, color: "#58a6ff", fontSize: 11, lineHeight: 1.4 }}>
              🎯 {example.learningGoal}
            </p>
          )}
        </div>
      )}

      {/* Code block */}
      <div style={{ position: "relative" }}>
        <button
          onClick={copy}
          style={{
            position: "absolute", top: 8, right: 10,
            background: "#21262d", color: copied ? "#7ee787" : "#8b949e",
            border: "1px solid #30363d", borderRadius: 5,
            padding: "3px 10px", cursor: "pointer", fontSize: 11, zIndex: 1,
            transition: "color 0.2s",
          }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
        <pre style={{
          padding: "14px 14px 14px 14px", margin: 0,
          background: "#0d1117", fontSize: 12.5, lineHeight: 1.65,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          overflowX: "auto", whiteSpace: "pre-wrap",
        }}>
          <code ref={codeRef} className={`language-${lang}`}>{example.code}</code>
        </pre>
      </div>

      {/* Expected Output toggle */}
      {example.expectedOutput && (
        <>
          <div style={{
            padding: "6px 14px", background: "#161b22",
            borderTop: "1px solid #21262d",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ color: "#8b949e", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>
              EXPECTED OUTPUT
            </span>
            <button
              onClick={() => setShowOutput(v => !v)}
              style={{ background: "transparent", color: "#58a6ff", border: "none", cursor: "pointer", fontSize: 11 }}
            >
              {showOutput ? "▲ Hide" : "▼ Show"}
            </button>
          </div>
          {showOutput && (
            <div style={{
              padding: "12px 14px", background: "#070b10",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5,
              color: "#7ee787", whiteSpace: "pre-wrap", lineHeight: 1.65,
              borderTop: "1px solid #21262d",
            }}>
              {example.expectedOutput}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PythonBlock;
