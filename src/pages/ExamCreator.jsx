import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios.js";

const ExamDetails = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch exam + its questions
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        // Fetch exam details
        const examRes = await API.get(`/exams/${examId}`);
        setExam(examRes.data);

        // Fetch questions for this exam
        const questionRes = await API.get(`/questions/${examId}`);
        setQuestions(questionRes.data || []);
      } catch (err) {
        console.error("Failed to fetch exam details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examId]);

  if (loading) return <p className="p-8 text-gray-500">Loading exam...</p>;
  if (!exam) return <p className="p-8 text-red-500">Exam not found.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{exam.title}</h1>
      <p className="text-gray-700 mb-6">
        Subject: {exam.subject} <br />
        Duration: {exam.duration} mins <br />
        Date: {new Date(exam.date).toLocaleString()}
      </p>

      <h2 className="text-2xl font-semibold mb-3">Questions:</h2>
      {questions.length === 0 ? (
        <p className="text-gray-500">No questions available for this exam.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((q, i) => (
            <li key={q._id} className="border p-4 rounded-lg bg-gray-50 shadow">
              <p className="font-medium">
                {i + 1}. {q.questionText}
              </p>
              <ul className="list-disc ml-6 mt-2">
                {q.options.map((opt, idx) => (
                  <li key={idx}>{opt}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExamDetails;
