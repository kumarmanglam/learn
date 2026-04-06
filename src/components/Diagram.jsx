// ─── Diagram (SVG) ───
const Diagram = ({ svg, caption }) => (
  <div style={{ margin: "16px 0", textAlign: "center" }}>
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: 10,
        padding: 20,
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
    {caption && <div style={{ color: "#8b949e", fontSize: 12, marginTop: 6, fontStyle: "italic" }}>{caption}</div>}
  </div>
);

export default Diagram;
