import { renderContent } from "../utils/renderContent";
import Diagram from "./Diagram";

export default function LearnTab({ topic }) {
  return (
    <div style={{ maxWidth: 800 }}>
      {renderContent(topic.content)}
      {topic.diagram && (
        <div style={{ margin: "20px 0" }}>
          <h3 style={{ color: "#58a6ff", fontSize: 16, marginBottom: 10 }}>📊 Visual Diagram</h3>
          <Diagram svg={topic.diagram} />
        </div>
      )}
      <div style={{ marginTop: 20, padding: 16, background: "#12261e", border: "1px solid #238636", borderRadius: 10 }}>
        <div style={{ color: "#7ee787", fontWeight: 700, marginBottom: 6 }}>✅ Ready to practice?</div>
        <div style={{ color: "#8b949e", fontSize: 13 }}>Switch to the <strong style={{ color: "#58a6ff" }}>Code</strong> tab for executable examples or <strong style={{ color: "#58a6ff" }}>Quiz</strong> tab to test your knowledge.</div>
      </div>
    </div>
  );
}
