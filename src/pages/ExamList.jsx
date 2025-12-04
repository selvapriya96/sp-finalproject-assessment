import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios.js";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await API.get("/exams");
        setExams(res.data || []);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  if (loading) {
    return <p className="p-8 text-gray-500">Loading exams...</p>;
  }

  if (!exams.length) {
    return <p className="p-8 text-gray-500">No exams available.</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Available Exams</h1>
      <ul className="space-y-4">
        {exams.map((exam) => (
          <li
            key={exam._id}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{exam?.title || "Untitled Exam"}</h2>
            <p>Duration: {exam?.duration || 0} minutes</p>
            <p>
              Date:{" "}
              {exam?.date
                ? new Date(exam.date).toLocaleDateString() + " " + new Date(exam.date).toLocaleTimeString()
                : "TBA"}
            </p>
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
