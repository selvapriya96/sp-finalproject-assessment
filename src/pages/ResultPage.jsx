import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">No result data available.</p>
        <button
          onClick={() => navigate("/exams")}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to Exams
        </button>
      </div>
    );
  }

  const { score, total, percentage, questions, answers, examName } = state;

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h2 className="text-3xl font-bold text-center">{examName} - Results</h2>

      <div className="text-center mt-4">
        <p className="text-xl font-semibold">
          Score: {score} / {total}
        </p>
        <p className="text-lg">Percentage: {percentage}%</p>
      </div>

      <h3 className="text-xl font-bold mt-6 mb-3">Answer Review</h3>

      {questions.map((q, index) => (
        <div key={q._id} className="p-4 border rounded mb-3">
          <p className="font-semibold">
            {index + 1}. {q.question}
          </p>
          <p>Your answer: {answers[q._id]}</p>
          <p>Correct answer: {q.correctAnswer}</p>
        </div>
      ))}

      <button
        onClick={() => navigate("/exams")}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Back to Exams
      </button>
    </div>
  );
};

export default ResultPage;
