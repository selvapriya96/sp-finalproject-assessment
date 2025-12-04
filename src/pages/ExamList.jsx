import { useState, useEffect } from "react";
import API from "../api/axios.js";
import { useNavigate } from "react-router-dom";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null); 
  const navigate = useNavigate();

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

  if (loading) return <p className="p-8 text-gray-500">Loading exams...</p>;
  if (!exams.length) return <p className="p-8 text-gray-500">No exams available.</p>;

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
                ? new Date(exam.date).toLocaleDateString() +
                  " " +
                  new Date(exam.date).toLocaleTimeString()
                : "TBA"}
            </p>
            <button
              onClick={() => setSelectedExam(exam)}
              className="text-blue-600 font-semibold hover:underline mt-2"
            >
              Take Exam →
            </button>
          </li>
        ))}
      </ul>

      {selectedExam && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">{selectedExam.title}</h2>
            <p className="mb-4">Duration: {selectedExam.duration} minutes</p>
            <p className="mb-6">Are you ready to start this exam?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  navigate(`/exam/${selectedExam._id}`);
                  setSelectedExam(null);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Start Exam
              </button>
              <button
                onClick={() => setSelectedExam(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamList;
