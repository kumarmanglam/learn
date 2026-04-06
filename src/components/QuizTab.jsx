import Quiz from "./Quiz";

export default function QuizTab({ topic }) {
  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ color: "#e6edf3", fontSize: 20, marginBottom: 16 }}>🧪 Practice Quiz</h2>
      <p style={{ color: "#8b949e", fontSize: 13, marginBottom: 16 }}>Test your understanding of {topic.title}.</p>
      <Quiz questions={topic.quiz} />
    </div>
  );
}
