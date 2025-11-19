import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TakeExam = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds



  const navigate = useNavigate();
  // ✅ Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/questions/${id}`);
        setQuestions(res.data);
      } catch (err) {
        console.error("❌ Error fetching questions:", err);
      }
    };
    fetchQuestions();
  }, [id]);

  // ✅ Timer countdown
  useEffect(() => {
    if (submitted) return; // Stop timer after submission

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("⏰ Time’s up! Your exam will be auto-submitted.");
          handleSubmit();
          return 0;
        }
        if (prev === 60) {
          alert("⚠️ Only 1 minute left!");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  // ✅ Format time (mm:ss)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const handleSelect = (option) => {
    setAnswers({ ...answers, [current]: option });
  };

  const handleSubmit = async () => {
    let total = 0;
    questions.forEach((q, i) => {
      if (answers[i] && answers[i].trim() === q.correctAnswer.trim()) total++;
    });
    setScore(total);
    setSubmitted(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id;

      if (!userId) {
        alert("Please log in before taking the exam.");
        navigate("/login");
        return;
      }

      const resultData = {
        user: userId,
        examId: id,
        score: total,
        total: questions.length,
        percentage: ((total / questions.length) * 100).toFixed(2),
      };

      console.log("📤 Sending result data:", resultData);

      await axios.post("http://localhost:5000/api/results", resultData);
      console.log("✅ Result saved to database");
    } catch (err) {
      console.error("❌ Failed to save result:", err.response?.data || err);
    }

    navigate("/result", { state: { score: total, total: questions.length } });
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const prevQuestion = () => {
    if (current > 0) setCurrent(current - 1);
  };

  if (questions.length === 0)
    return <p className="text-center mt-10 text-gray-600">Loading questions...</p>;

  // ✅ After submission
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-green-600 mb-4 text-center">
          🎯 Exam Completed
        </h2>
        <p className="text-xl text-center mb-8">
          You scored <span className="font-semibold">{score}</span> out of{" "}
          {questions.length}
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
                  Q{index + 1}. {q.text}
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
            onClick={() => window.location.reload()}
          >
            Retake Exam
          </button>
        </div>
      </div>
    );
  }

  // ✅ Review Before Submit mode
  if (reviewMode) {
    return (
      <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          🧐 Review Your Answers Before Submitting
        </h2>

        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition">
              <p className="font-semibold mb-1">
                Q{index + 1}. {q.text}
              </p>
              <p>
                <strong>Your answer:</strong>{" "}
                <span
                  className={`${answers[index] ? "text-blue-700" : "text-red-600"
                    }`}
                >
                  {answers[index] || "Not answered"}
                </span>
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
            onClick={() => setReviewMode(false)}
          >
            ⬅ Go Back
          </button>
          <button
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            onClick={handleSubmit}
          >
            ✅ Confirm & Submit
          </button>
        </div>
      </div>
    );
  }

  // ✅ Normal Question View
  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg relative">
      {/* ✅ Timer Display */}
      <div className="absolute top-4 right-6 bg-gray-800 text-white px-4 py-2 rounded-lg">
        ⏱ {formatTime(timeLeft)}
      </div>

      {/* ✅ Progress Bar */}
      <div className="mb-6 mt-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {current + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div
            className="h-3 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-800">{q.questionText}</h2>

      {q.options.map((opt, idx) => (
        <div key={idx} className="mb-3">
          <label className="flex items-center">
            <input
              type="radio"
              name={`question-${current}`}
              checked={answers[current] === opt}
              onChange={() => handleSelect(opt)}
              className="mr-2 accent-blue-600"
            />
            {opt}
          </label>
        </div>
      ))}

      {/* ✅ Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevQuestion}
          disabled={current === 0}
          className={`px-4 py-2 rounded ${current === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
        >
          Previous
        </button>

        {current === questions.length - 1 ? (
          <button
            onClick={() => setReviewMode(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Review Before Submit
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeExam;
