import { useEffect, useState } from "react";
import API from "../api/axios";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const token = localStorage.getItem("token");

        const stu = await API.get("/auth/admin/students", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const ex = await API.get("/exams/admin/all", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const res = await API.get("/results/admin/all", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStudents(stu.data);
        setExams(ex.data);
        setResults(res.data);
      } catch (error) {
        console.error("Admin Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  if (loading) return <p className="p-5">Loading admin data...</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Students */}
      <h2 className="text-xl font-semibold mt-4">Students</h2>
      <ul>
        {students.length ? (
          students.map((s) => (
            <li key={s._id}>{s.name} - {s.email}</li>
          ))
        ) : (
          <li>No students found</li>
        )}
      </ul>

      {/* Exams */}
      <h2 className="text-xl font-semibold mt-4">Exams</h2>
      <ul>
        {exams.length ? (
          exams.map((e) => (
            <li key={e._id}>{e.title}</li>
          ))
        ) : (
          <li>No exams found</li>
        )}
      </ul>

      {/* Results */}
      <h2 className="text-xl font-semibold mt-4">Results</h2>
      <ul>
        {results.length ? (
          results.map((r) => (
            <li key={r._id}>
              {r.userId?.name} - {r.examId?.title} - {r.score}/{r.total} ({r.percentage}%)
            </li>
          ))
        ) : (
          <li>No results found</li>
        )}
      </ul>
    </div>
  );
};

export default AdminDashboard;
