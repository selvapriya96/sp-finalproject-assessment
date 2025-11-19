import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ExamDetails = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Fetch exam + its questions
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const examRes = await axios.get(`http://localhost:5000/api/exams/${examId}`);
        setExam(examRes.data);

        const questionRes = await axios.get(`http://localhost:5000/api/questions/${examId}`);
        setQuestions(questionRes.data);
      } catch (err) {
        console.error("Failed to fetch exam details:", err);
      }
    };

    fetchExamData();
  }, [examId]);

  if (!exam) return <p className="p-8 text-gray-500">Loading exam...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{exam.title}</h1>
      <p className="text-gray-700 mb-6">
        Subject: {exam.subject} <br />
        Duration: {exam.duration} mins <br />
        Date: {new Date(exam.date).toLocaleString()}
      </p>

      <h2 className="text-2xl font-semibold mb-3">Questions:</h2>
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
    </div>
  );
};

export default ExamDetails;
