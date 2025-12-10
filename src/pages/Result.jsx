// src/pages/Result.jsx
import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-5 text-center">
        <p className="text-red-500">No result data found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  const { score, total, percentage, questions, answers, examName } = state;

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-4">{examName} - Results</h1>
      <p className="text-xl text-center">Score: {score} / {total}</p>
      <p className="text-lg text-center mb-4">Percentage: {percentage}%</p>

      <button
        onClick={() => navigate("/result-review", { state })}
        className="bg-yellow-500 text-white px-4 py-2 rounded mt-3"
      >
        Review Answers
      </button>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-3 ml-3"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Result;
