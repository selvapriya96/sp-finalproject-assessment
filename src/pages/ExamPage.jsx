// src/pages/ExamPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const ExamPage = () => {
  const { id } = useParams(); // examId from route
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [examName, setExamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");

  // Fetch exam and questions
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const examRes = await API.get(`/exams/${id}`);
        const quesRes = await API.get(`/questions/${id}`);

        setExamName(examRes.data.title || examRes.data.exam?.title || "Untitled Exam");
        setQuestions(Array.isArray(quesRes.data) ? quesRes.data : []);

        if (!quesRes.data || quesRes.data.length === 0) {
          setError("No questions found for this exam.");
        }

        setTimeLeft(examRes.data.duration * 60 || 0);
      } catch (err) {
        console.error("Error fetching exam:", err);
        setError("Failed to load exam. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const score = questions.reduce(
        (acc, q) => acc + (answers[q._id] === q.correctAnswer ? 1 : 0),
        0
      );
      const total = questions.length;
      const percentage = Math.round((score / total) * 100);

      const formattedAnswers = questions.map(q => ({
        questionId: q._id,
        givenAnswer: answers[q._id] || null,
        isCorrect: answers[q._id] === q.correctAnswer,
        marksAwarded: answers[q._id] === q.correctAnswer ? 1 : 0,
      }));

      const payload = {
        userId: user.id,
        examId: id,
        score,
        total,
        percentage,
        answers: formattedAnswers,
      };

      await API.post("/results", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/result", {
        state: { score, total, percentage, questions, examName, answers: formattedAnswers },
      });
    } catch (err) {
      console.error("Error submitting exam:", err.response || err);
      alert("Failed to submit exam.");
    }
  };

  if (loading) return <p className="p-5">Loading exam...</p>;
  if (error) return <p className="p-5 text-red-500">{error}</p>;
  if (!questions.length) return <p className="p-5">No questions available.</p>;

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">{examName}</h1>

      {timeLeft > 0 && (
        <p className="text-red-500 font-semibold mb-4">
          Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </p>
      )}

      {questions.map((q, i) => (
        <div key={q._id} className="p-4 mb-3 border rounded">
          <p className="font-semibold">
            {i + 1}. {q.questionText || "No question text"}
          </p>

          {q.options.map(opt => {
            const val = String(opt);
            return (
              <label key={val} className="block mt-1">
                <input
                  type="radio"
                  name={q._id}
                  value={val}
                  checked={answers[q._id] === val}
                  onChange={() => handleAnswer(q._id, val)}
                />{" "}
                {val}
              </label>
            );
          })}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Submit Exam
      </button>
    </div>
  );
};

export default ExamPage;
