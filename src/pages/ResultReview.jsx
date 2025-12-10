// src/pages/ResultReview.jsx
import { useLocation, useNavigate } from "react-router-dom";

const ResultReview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-5 text-center">
        <p className="text-red-500">No data to review.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  const { questions, answers } = state;

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4 text-center">Answer Review</h1>

      {questions.map((q, i) => {
        const answerObj = answers.find(a => a.questionId === q._id);
        return (
          <div key={q._id} className="p-4 mb-3 border rounded">
            <p className="font-semibold">
              {i + 1}. {q.questionText}
            </p>
            <p className="text-green-500"><span className="text-blue-500">Your answer:</span> {answerObj?.givenAnswer || "Not answered"}</p>
            <p className="text-red-500"><span className="text-blue-900">Correct answer:</span> {q.correctAnswer}</p>
          </div>
        );
      })}

      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ResultReview;
