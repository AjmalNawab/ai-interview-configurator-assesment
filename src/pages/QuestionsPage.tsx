import React from "react";
import { Link } from "react-router-dom";
import FixedQuestionList from "../components/FixedQuestionList";

const QuestionsPage: React.FC = () => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Questions</h1>
        <Link className="text-sm text-blue-600 hover:underline" to="/configure">
          Back to Configure
        </Link>
      </div>
      <FixedQuestionList />
    </div>
  );
};

export default QuestionsPage;
