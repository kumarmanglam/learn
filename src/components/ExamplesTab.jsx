import CodeRunner from "./CodeRunner";

export default function ExamplesTab({ topic }) {
  return (
    <div style={{ maxWidth: 800 }}>
      <h2 style={{ color: "#e6edf3", fontSize: 20, marginBottom: 16 }}>💻 Executable Examples</h2>
      <p style={{ color: "#8b949e", fontSize: 13, marginBottom: 16 }}>Click ▶ Execute to run each example and see the output.</p>
      {topic.examples.map((ex, i) => (
        <div key={i} style={{ marginBottom: 24 }}>
          <h3 style={{ color: "#58a6ff", fontSize: 15, marginBottom: 8 }}>Example {i + 1}: {ex.title}</h3>
          <CodeRunner code={ex.code} title={ex.title} />
        </div>
      ))}
    </div>
  );
}
