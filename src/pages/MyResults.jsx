import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-5">
        <p>No result data found.</p>
        <button onClick={() => navigate("/exams")} className="mt-2 text-blue-600">
          Back to Exams
        </button>
      </div>
    );
  }

  const { score, total, percentage, examName, questions, answers } = state;

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">{examName}</h1>
      <p className="mb-2">
        <strong>Score:</strong> {score} / {total} ({percentage}%)
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Your Answers</h2>
      {questions.map((q, i) => (
        <div key={q._id} className="p-3 mb-2 border rounded">
          <p>
            {i + 1}. {q.questionText || q.question || "No question text"}
          </p>
          <p>
            <strong>Your Answer:</strong> {answers[q._id] || "Not answered"}
          </p>
          <p>
            <strong>Correct Answer:</strong> {q.correctAnswer}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Result;
