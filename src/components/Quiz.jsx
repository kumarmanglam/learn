import { useState } from "react";

// ─── Quiz Component ───
const Quiz = ({ questions }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const q = questions[current];

  const handleSelect = (idx) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    if (idx === q.answer) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setDone(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setShowAnswer(false);
  };

  const reset = () => { setCurrent(0); setSelected(null); setScore(0); setDone(false); setShowAnswer(false); };

  if (done) return (
    <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>🎯</div>
      <div style={{ color: "#e6edf3", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Quiz Complete!</div>
      <div style={{ color: "#7ee787", fontSize: 24, fontWeight: 700, marginBottom: 12 }}>{score}/{questions.length}</div>
      <div style={{ color: "#8b949e", marginBottom: 16 }}>{score === questions.length ? "Perfect! You nailed it!" : score >= questions.length * 0.7 ? "Great job! Review the ones you missed." : "Keep studying and try again!"}</div>
      <button onClick={reset} style={{ background: "#1f6feb", color: "#fff", border: "none", borderRadius: 6, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}>Retry Quiz</button>
    </div>
  );

  return (
    <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, padding: 20, margin: "16px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ color: "#8b949e", fontSize: 13 }}>Question {current + 1}/{questions.length}</span>
        <span style={{ color: "#58a6ff", fontSize: 13 }}>Score: {score}</span>
      </div>
      <div style={{ color: "#e6edf3", fontSize: 15, fontWeight: 600, marginBottom: 14, lineHeight: 1.5 }}>{q.question}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options.map((opt, i) => {
          let bg = "#161b22";
          let border = "#30363d";
          if (showAnswer) {
            if (i === q.answer) { bg = "#12261e"; border = "#238636"; }
            else if (i === selected) { bg = "#2d1418"; border = "#da3633"; }
          } else if (i === selected) { bg = "#1c2333"; border = "#1f6feb"; }
          return (
            <div key={i} onClick={() => handleSelect(i)} style={{ padding: "10px 14px", background: bg, border: `1px solid ${border}`, borderRadius: 8, color: "#e6edf3", cursor: showAnswer ? "default" : "pointer", fontSize: 14, transition: "all 0.15s" }}>
              <span style={{ color: "#8b949e", marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span>{opt}
            </div>
          );
        })}
      </div>
      {showAnswer && (
        <div style={{ marginTop: 12 }}>
          <div style={{ color: "#8b949e", fontSize: 13, padding: "8px 12px", background: "#161b22", borderRadius: 6, lineHeight: 1.5 }}>
            💡 {q.explanation}
          </div>
          <button onClick={next} style={{ marginTop: 10, background: "#1f6feb", color: "#fff", border: "none", borderRadius: 6, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}>
            {current + 1 >= questions.length ? "See Results" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
