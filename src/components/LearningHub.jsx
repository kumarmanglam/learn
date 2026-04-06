import { useState, useEffect, useMemo, useRef } from "react";
import { TOPICS } from "../data/topics";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import WelcomeScreen from "./WelcomeScreen";
import LearnTab from "./LearnTab";
import ExamplesTab from "./ExamplesTab";
import QuizTab from "./QuizTab";

// ─── MAIN APP ───
export default function LearningHub() {
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeTab, setActiveTab] = useState("learn");
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const contentRef = useRef(null);

  const filteredTopics = useMemo(() => {
    if (!searchQuery) return TOPICS;
    const q = searchQuery.toLowerCase();
    return TOPICS.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const groupedTopics = useMemo(() => {
    const groups = {};
    filteredTopics.forEach(t => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, [filteredTopics]);

  const toggleComplete = (id) => {
    setCompletedTopics(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const topic = TOPICS.find(t => t.id === activeTopic);
  const progress = Math.round((completedTopics.size / TOPICS.length) * 100);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeTopic, activeTab]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#010409", color: "#e6edf3", fontFamily: "'Söhne', -apple-system, sans-serif", overflow: "hidden" }}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        groupedTopics={groupedTopics}
        activeTopic={activeTopic}
        setActiveTopic={setActiveTopic}
        setActiveTab={setActiveTab}
        completedTopics={completedTopics}
        toggleComplete={toggleComplete}
        progress={progress}
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          topic={topic}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "20px 24px 40px" }}>
          {!topic ? (
            <WelcomeScreen />
          ) : activeTab === "learn" ? (
            <LearnTab topic={topic} />
          ) : activeTab === "examples" ? (
            <ExamplesTab topic={topic} />
          ) : activeTab === "quiz" ? (
            <QuizTab topic={topic} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
