import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await API.get("/exams"); // fetch all exams
        setExams(res.data);
      } catch (err) {
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  if (loading) return <p className="p-5">Loading exams...</p>;
  if (!exams.length) return <p className="p-5">No exams available.</p>;

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Available Exams</h1>

      {exams.map((exam) => (
        <div
          key={exam._id}
          className="p-4 mb-3 border rounded flex justify-between items-center"
        >
          <div>
            <h2 className="text-lg font-semibold">{exam.title}</h2>
            <p>Duration: {exam.duration} minutes</p>
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate(`/exam/${exam._id}`)}
          >
            Go to Test
          </button>
        </div>
      ))}
    </div>
  );
};

export default Exams;
