import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Fetch exam questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/questions/${examId}`);
        setQuestions(res.data);

        // get exam details for timer
        const examRes = await axios.get(`http://localhost:5000/api/exams`);
        const currentExam = examRes.data.find((e) => e._id === examId);
        if (currentExam) setTimeLeft(currentExam.duration * 60);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };
    fetchQuestions();
  }, [examId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const handlePrevious = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = () => {
    const score = questions.reduce((acc, q) => {
      return acc + (answers[q._id] === q.correctAnswer ? 1 : 0);
    }, 0);
    navigate("/result", { state: { score, total: questions.length } });
  };

  // ✅ Review Mode Page
  if (isReviewMode) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Review Your Answers</h1>
        <ul className="space-y-4">
          {questions.map((q) => (
            <li key={q._id} className="border p-4 rounded-lg shadow">
              <p className="font-semibold">{q.text}</p>
              {q.options.map((opt, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    checked={answers[q._id] === opt}
                    onChange={() => handleAnswer(q._id, opt)}
                  />{" "}
                  {opt}
                </label>
              ))}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setIsReviewMode(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Back to Exam
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Final Answers
          </button>
        </div>
      </div>
    );
  }

  // ✅ Normal Exam View
  if (questions.length === 0) return <p>Loading questions...</p>;

  const q = questions[current];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">
          Question {current + 1} / {questions.length}
        </h2>
        <p className="text-lg font-semibold text-red-500">
          Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </p>
      </div>

      <div className="border p-6 rounded-lg shadow-md">
        <p className="text-lg mb-4">{q.text}</p>
        {q.options.map((opt, i) => (
          <label key={i} className="block">
            <input
              type="radio"
              name={q._id}
              value={opt}
              checked={answers[q._id] === opt}
              onChange={() => handleAnswer(q._id, opt)}
            />{" "}
            {opt}
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={current === 0}
          className="bg-gray-400 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {current < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={() => setIsReviewMode(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Review Before Submit
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPage;
