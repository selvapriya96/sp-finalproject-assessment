import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios.js";

const Home = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await API.get("/exams");
        
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setExams(data);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
        setExams([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  if (loading) return <p className="p-8">Loading exams...</p>;
  if (!exams.length) return <p className="p-8">No exams available</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Available Exams</h1>
      <ul className="space-y-4">
        {exams.map((exam) => (
          <li
            key={exam._id}
            className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/exam/${exam._id}`)}
          >
            <h2 className="text-xl font-semibold">{exam.title}</h2>
            <p><strong>Subject:</strong> {exam.subject}</p>
            <p><strong>Date:</strong> {new Date(exam.date).toLocaleString()}</p>
            <p><strong>Duration:</strong> {exam.duration} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
