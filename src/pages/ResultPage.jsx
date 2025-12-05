import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-red-500">
          ⚠️ No result data found!
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    );
  }

  const { score, total, percentage, examName, answers, questions, userName } = state;

  return (
    <div className="max-w-xl mx-auto mt-20 p-8 bg-white shadow-lg rounded-lg text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Exam Completed!</h1>

      {examName && (
        <p className="text-lg mb-2">
          <strong>Exam:</strong> {examName}
        </p>
      )}

      {userName && (
        <p className="text-lg mb-2">
          <strong>Student:</strong> {userName}
        </p>
      )}

      <p className="text-xl mb-2">
        You scored <span className="font-semibold">{score}</span> out of{" "}
        <span className="font-semibold">{total}</span>
      </p>

      <p
        className={`text-2xl font-bold ${
          percentage >= 50 ? "text-green-700" : "text-red-600"
        }`}
      >
        {percentage}%
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          🏠 Go Home
        </button>

        {answers && questions && (
          <button
            onClick={() => navigate("/result-review", { state })}
            className="bg-yellow-500 text-white px-5 py-2 rounded hover:bg-yellow-600"
          >
            📝 Review Answers
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
