import { useState } from "react";

export default function FlashcardsTab({ topic }) {
  const cards = topic.flashcards || [];
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());
  const [reviewOnly, setReviewOnly] = useState(false);

  if (cards.length === 0) {
    return (
      <div style={{ maxWidth: 600, color: "#8b949e", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🃏</div>
        <div>No flashcards for this topic yet.</div>
      </div>
    );
  }

  const deck = reviewOnly ? cards.filter((_, i) => !known.has(i)) : cards;
  const idx = current % (deck.length || 1);
  const card = deck[idx];
  const originalIdx = reviewOnly ? cards.indexOf(card) : current;

  const goNext = (markKnown) => {
    if (markKnown) setKnown(prev => new Set([...prev, originalIdx]));
    setFlipped(false);
    setTimeout(() => setCurrent(c => (c + 1) % deck.length), 50);
  };

  const reset = () => {
    setKnown(new Set());
    setCurrent(0);
    setFlipped(false);
    setReviewOnly(false);
  };

  const remaining = cards.length - known.size;

  if (remaining === 0) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", paddingTop: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
        <div style={{ color: "#e6edf3", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>All cards mastered!</div>
        <div style={{ color: "#7ee787", fontSize: 14, marginBottom: 24 }}>{cards.length}/{cards.length} known</div>
        <button onClick={reset} style={{ background: "#1f6feb", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
          Restart Deck
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ color: "#e6edf3", fontSize: 20, margin: 0 }}>🃏 Flashcards</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ color: "#8b949e", fontSize: 13 }}>
            {known.size}/{cards.length} known
          </span>
          <button
            onClick={() => { setReviewOnly(v => !v); setCurrent(0); setFlipped(false); }}
            style={{
              background: reviewOnly ? "#1f6feb" : "transparent",
              color: reviewOnly ? "#fff" : "#8b949e",
              border: "1px solid #30363d", borderRadius: 6,
              padding: "3px 10px", cursor: "pointer", fontSize: 11,
            }}
          >
            Review only
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 5, background: "#21262d", borderRadius: 3, marginBottom: 22, overflow: "hidden" }}>
        <div style={{
          width: `${(known.size / cards.length) * 100}%`,
          height: "100%", background: "#238636", borderRadius: 3,
          transition: "width 0.4s ease",
        }} />
      </div>

      {/* Card counter */}
      <div style={{ color: "#8b949e", fontSize: 12, textAlign: "center", marginBottom: 10 }}>
        Card {(idx % deck.length) + 1} of {deck.length}
        {reviewOnly && <span style={{ color: "#f0883e", marginLeft: 6 }}>• review mode</span>}
      </div>

      {/* Flashcard */}
      <div
        onClick={() => setFlipped(v => !v)}
        style={{
          minHeight: 220,
          background: flipped ? "#0d2016" : "#161b22",
          border: `2px solid ${flipped ? "#238636" : "#30363d"}`,
          borderRadius: 14,
          padding: "32px 28px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transition: "all 0.25s ease",
          marginBottom: 16,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 12, right: 14, fontSize: 10, color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {flipped ? "Answer" : "Question — click to flip"}
        </div>
        <div style={{ color: "#e6edf3", fontSize: 15, lineHeight: 1.7, maxWidth: 480 }}>
          {flipped ? card.back : card.front}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button
          onClick={() => goNext(false)}
          style={{
            background: "#21262d", color: "#8b949e",
            border: "1px solid #30363d", borderRadius: 8,
            padding: "10px 22px", cursor: "pointer", fontSize: 14, fontWeight: 500,
          }}
        >
          Still learning →
        </button>
        <button
          onClick={() => goNext(true)}
          disabled={!flipped}
          style={{
            background: flipped ? "#238636" : "#161b22",
            color: flipped ? "#fff" : "#30363d",
            border: "none", borderRadius: 8,
            padding: "10px 22px",
            cursor: flipped ? "pointer" : "not-allowed",
            fontSize: 14, fontWeight: 700,
            transition: "all 0.2s",
          }}
        >
          Got it ✓
        </button>
      </div>

      {known.size > 0 && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={reset} style={{ background: "transparent", color: "#8b949e", border: "none", cursor: "pointer", fontSize: 12 }}>
            Reset deck
          </button>
        </div>
      )}
    </div>
  );
}
