import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios.js";

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const examRes = await API.get(`/exams/${examId}`);
        if (examRes.data?.duration) setTimeLeft(examRes.data.duration * 60);

        const questionRes = await API.get(`/questions/${examId}`);
        setQuestions(questionRes.data || []);
      } catch (err) {
        console.error("Failed to fetch exam/questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

 
  useEffect(() => {
    if (submitted || reviewMode || loading) return;
    if (timeLeft <= 0 && questions.length > 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("⏰ Time's up! Exam will be auto-submitted.");
          handleSubmit();
          return 0;
        }
        if (prev === 60) alert("⚠️ Only 1 minute left!");
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted, reviewMode, loading]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSelect = (option) => setAnswers({ ...answers, [current]: option });

  const nextQuestion = () => current < questions.length - 1 && setCurrent(current + 1);
  const prevQuestion = () => current > 0 && setCurrent(current - 1);

  const handleSubmit = async () => {
    if (!questions.length) return;

    const totalScore = questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);

    setScore(totalScore);
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
        examId,
        score: totalScore,
        total: questions.length,
        percentage: ((totalScore / questions.length) * 100).toFixed(2),
        answers,
        questions,
      };

      await API.post("/results", resultData);
    } catch (err) {
      console.error("Failed to save result:", err.response?.data || err);
    }

    navigate("/result", {
      state: {
        score: totalScore,
        total: questions.length,
        percentage: ((totalScore / questions.length) * 100).toFixed(2),
        answers,
        questions,
      },
    });
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading exam...</p>;
  if (!questions.length) return <p className="text-center mt-10 text-gray-600">No questions available.</p>;


  if (reviewMode) {
    return (
      <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">🧐 Review Your Answers</h2>
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50 transition">
              <p className="font-semibold mb-1">{idx + 1}. {q.questionText}</p>
              <p>
                <strong>Your answer:</strong>{" "}
                <span className={answers[idx] ? "text-blue-700" : "text-red-600"}>
                  {answers[idx] || "Not answered"}
                </span>
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-700"
            onClick={() => setReviewMode(false)}
          >
            ⬅ Go Back
          </button>
          <button
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            ✅ Submit Final Answers
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg relative">
      {/* Timer */}
      <div className="absolute top-4 right-6 bg-gray-800 text-white px-4 py-2 rounded-lg">
        ⏱ {formatTime(timeLeft)}
      </div>

      
      <div className="mb-6 mt-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Question {current + 1} of {questions.length}</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div className="h-3 bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
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

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevQuestion}
          disabled={current === 0}
          className={`px-4 py-2 rounded ${current === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-600 text-white hover:bg-gray-700"}`}
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
