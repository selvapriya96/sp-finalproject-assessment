import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <p className="text-center mt-10 text-gray-600">No result data found.</p>;
  }

  const { score, total, percentage, answers, questions, userName, examName } = state;

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-green-600 mb-4 text-center">🎯 Exam Result</h2>

      <p className="text-xl text-center mb-8">
        className="text-center text-gray-700 mb-4"
        <strong>Candidate:</strong> {userName} <br />
        <strong>Exam:</strong> {examName}

      </p>

      <h3 className="text-2xl font-semibold mb-4">🧾 Review Answers</h3>
      <div className="space-y-6">
        {questions.map((q, index) => {
          const userAnswer = answers[index];
          const isCorrect = userAnswer === q.correctAnswer;
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${isCorrect ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"
                }`}
            >
              <p className="font-semibold mb-2">
                Q{index + 1}. {q.questionText}
              </p>
              <p>
                <strong>Your answer:</strong>{" "}
                <span className={isCorrect ? "text-green-700" : "text-red-700"}>
                  {userAnswer || "Not answered"}
                </span>
              </p>
              {!isCorrect && (
                <p>
                  <strong>Correct answer:</strong>{" "}
                  <span className="text-green-700">{q.correctAnswer}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Result;
