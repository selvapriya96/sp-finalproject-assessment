import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API = "https://sp-finalproject-assessment-bd.onrender.com/api";

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [examName, setExamName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const examRes = await axios.get(`${API}/exams/${examId}`);
        const quesRes = await axios.get(`${API}/questions/${examId}`);

        setExamName(examRes.data.exam.title);
        setQuestions(quesRes.data.questions);
        setLoading(false);
      } catch (err) {
        console.error("Error loading exam:", err);
      }
    };

    fetchExamData();
  }, [examId]);

  const handleAnswer = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        examId,
        answers,
      };

      const res = await axios.post(`${API}/results/save`, payload);

      navigate("/result", {
        state: {
          ...res.data,
          questions,
          examName,
        },
      });
    } catch (err) {
      console.error("Error submitting exam:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">{examName}</h1>

      {questions.map((q) => (
        <div key={q._id} className="mb-4 p-4 border rounded">
          <p className="font-semibold">{q.question}</p>

          {q.options.map((opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name={q._id}
                value={opt}
                checked={answers[q._id] === opt}
                onChange={() => handleAnswer(q._id, opt)}
              />
              <span className="ml-2">{opt}</span>
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Exam
      </button>
    </div>
  );
};

export default TakeExam;
