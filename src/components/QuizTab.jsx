import Quiz from "./Quiz";

const DIFF = {
  easy:   { color: "#7ee787", bg: "#7ee78718", label: "Easy" },
  medium: { color: "#f0883e", bg: "#f0883e18", label: "Medium" },
  hard:   { color: "#f85149", bg: "#f8514918", label: "Hard" },
};

export default function QuizTab({ topic }) {
  const questions = topic.quiz || [];

  if (questions.length === 0) {
    return (
      <div style={{ maxWidth: 700, color: "#8b949e", padding: "40px 0", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🧪</div>
        <div>No quiz questions for this topic yet.</div>
      </div>
    );
  }

  const counts = { easy: 0, medium: 0, hard: 0 };
  questions.forEach(q => { if (q.difficulty && counts[q.difficulty] !== undefined) counts[q.difficulty]++; });
  const hasDifficulty = Object.values(counts).some(v => v > 0);

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ color: "#e6edf3", fontSize: 20, margin: 0 }}>🧪 Practice Quiz</h2>
        {hasDifficulty && (
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(DIFF).map(([key, meta]) => {
              if (!counts[key]) return null;
              return (
                <span key={key} style={{ fontSize: 12, color: meta.color, background: meta.bg, padding: "3px 10px", borderRadius: 12 }}>
                  {meta.label}: {counts[key]}
                </span>
              );
            })}
          </div>
        )}
      </div>
      <p style={{ color: "#8b949e", fontSize: 13, marginBottom: 18 }}>
        {questions.length} question{questions.length !== 1 ? "s" : ""} on {topic.title}.
      </p>
      <Quiz questions={questions} />
    </div>
  );
}
