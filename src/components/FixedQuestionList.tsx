import React, { useState, useMemo } from "react";
import questionBank from "../data/question-bank-data.json";

interface Question {
  id: string;
  title: string;
  difficulty: string;
  topic: string;
  score: number;
  date: string;
  tags: string[];
}

interface Filters {
  difficulty?: string;
  topic?: string;
}

const FixedQuestionList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});

  const questions: Question[] = questionBank;

  // Memoized filtered questions for performance
  const filteredQuestions = useMemo(() => {
    return questions
      .filter((q) => q.title.toLowerCase().includes(search.toLowerCase()))
      .filter((q) =>
        filters.difficulty ? q.difficulty === filters.difficulty : true,
      )
      .filter((q) => (filters.topic ? q.topic === filters.topic : true))
      .sort((a, b) => b.score - a.score)
      .map((q) => ({
        ...q,
        formattedDate: new Date(q.date).toLocaleDateString(),
        displayTags: q.tags.join(", "),
      }));
  }, [search, filters, questions]);

  const handleClick = (question: Question) => {
    setSelectedId(question.id);
    // Mock tracking API
    fetch("/api/track", {
      method: "POST",
      body: JSON.stringify({ id: question.id }),
    }).catch((err) => console.error("Track API failed:", err));
  };

  return (
    <div className="p-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search questions..."
        className="border p-2 rounded w-full mb-4"
      />

      <div style={{ height: "500px", overflowY: "auto" }}>
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            onClick={() => handleClick(q)}
            className={`p-3 mb-2 border rounded cursor-pointer ${
              selectedId === q.id ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <h3 className="font-semibold">{q.title}</h3>
            <p>
              Difficulty: {q.difficulty} | Topic: {q.topic} | Score: {q.score}
            </p>
            <p>Tags: {q.displayTags}</p>
            <p>Date: {q.formattedDate}</p>
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && <p>No questions found.</p>}
    </div>
  );
};

export default FixedQuestionList;
