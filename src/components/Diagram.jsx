import { useRef, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";

// ─── Static SVG diagram ───
const StaticDiagram = ({ svg, caption, title }) => (
  <div style={{ margin: "16px 0", textAlign: "center" }}>
    {title && (
      <div style={{ color: "#58a6ff", fontSize: 13, fontWeight: 600, marginBottom: 8, textAlign: "left" }}>
        📊 {title}
      </div>
    )}
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: 10,
        padding: "20px",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
    {caption && (
      <div style={{ color: "#8b949e", fontSize: 12, marginTop: 6, fontStyle: "italic" }}>{caption}</div>
    )}
  </div>
);

// ─── Interactive HTML widget (sandboxed iframe) ───
const InteractiveDiagram = ({ html, title, caption }) => {
  const srcDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0d1117;
    color: #e6edf3;
    font-family: -apple-system, 'Segoe UI', sans-serif;
    font-size: 13px;
    padding: 16px;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0d1117; }
  ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
</style>
</head>
<body>${html}</body>
</html>`;

  return (
    <div style={{ margin: "16px 0" }}>
      {title && (
        <div style={{ color: "#f0883e", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          ⚡ {title}
        </div>
      )}
      <div style={{ border: "1px solid #21262d", borderRadius: 10, overflow: "hidden" }}>
        <iframe
          srcDoc={srcDoc}
          style={{ width: "100%", height: 340, border: "none", display: "block", background: "#0d1117" }}
          sandbox="allow-scripts"
          title={title || "Interactive widget"}
        />
      </div>
      {caption && (
        <div style={{ color: "#8b949e", fontSize: 12, marginTop: 6, textAlign: "center", fontStyle: "italic" }}>
          {caption}
        </div>
      )}
    </div>
  );
};

// ─── Executable Python code diagram ───
const ExecutableDiagram = ({ code, expectedOutput, title, caption, language = "python", pipInstall }) => {
  const codeRef = useRef(null);
  useEffect(() => {
    if (codeRef.current) Prism.highlightElement(codeRef.current);
  }, [code]);

  return (
    <div style={{ margin: "16px 0" }}>
      {title && (
        <div style={{ color: "#7ee787", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          📊 {title}
        </div>
      )}
      <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "6px 14px", background: "#161b22", borderBottom: "1px solid #21262d", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, background: "#3a5f8a", color: "#a5d6ff", padding: "1px 7px", borderRadius: 4, fontWeight: 700 }}>
            {language.toUpperCase()}
          </span>
          {pipInstall && (
            <code style={{ fontSize: 11, color: "#8b949e", fontFamily: "monospace" }}>pip install {pipInstall}</code>
          )}
          <span style={{ color: "#8b949e", fontSize: 11, marginLeft: "auto" }}>Run locally to see visualization</span>
        </div>
        <pre style={{ padding: "14px", margin: 0, fontSize: 12.5, lineHeight: 1.65, fontFamily: "monospace", overflowX: "auto", whiteSpace: "pre-wrap" }}>
          <code ref={codeRef} className={`language-${language}`}>{code}</code>
        </pre>
        {expectedOutput && (
          <>
            <div style={{ padding: "6px 14px", background: "#161b22", borderTop: "1px solid #21262d", color: "#8b949e", fontSize: 11, fontWeight: 600 }}>
              EXPECTED OUTPUT / VISUALIZATION
            </div>
            <div style={{ padding: "10px 14px", background: "#070b10", color: "#7ee787", fontSize: 12, fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {expectedOutput}
            </div>
          </>
        )}
      </div>
      {caption && (
        <div style={{ color: "#8b949e", fontSize: 12, marginTop: 6, textAlign: "center", fontStyle: "italic" }}>
          {caption}
        </div>
      )}
    </div>
  );
};

// ─── Main Diagram component — handles both old schema (svg prop) and new schema (diagram object) ───
const Diagram = ({ diagram, svg, caption }) => {
  // Old schema: called with svg string prop directly
  if (svg) return <StaticDiagram svg={svg} caption={caption} />;
  if (!diagram) return null;

  const { type, svg: diagSvg, html, code, expectedOutput, title, caption: diagCaption, language, pipInstall } = diagram;

  if (type === "interactive") {
    return <InteractiveDiagram html={html} title={title} caption={diagCaption} />;
  }
  if (type === "executable") {
    return (
      <ExecutableDiagram
        code={code}
        expectedOutput={expectedOutput}
        title={title}
        caption={diagCaption}
        language={language || "python"}
        pipInstall={pipInstall}
      />
    );
  }
  // type === "static" or no type
  return <StaticDiagram svg={diagSvg} caption={diagCaption} title={title} />;
};

export default Diagram;
