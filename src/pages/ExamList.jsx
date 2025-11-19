import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ExamList = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/exams");
        setExams(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExams();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Available Exams</h1>
      <ul className="space-y-4">
        {exams.map((exam) => (
          <li
            key={exam._id}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{exam.title}</h2>
            <p>Duration: {exam.duration} minutes</p>
            <p>Date: {new Date(exam.date).toLocaleString()}</p>
            <Link
              to={`/exam/${exam._id}`}
              className="text-blue-600 font-semibold hover:underline"
            >
              Take Exam →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamList;
