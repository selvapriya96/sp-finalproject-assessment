import { useEffect, useState } from "react";
import API from "../api/axios";

const AdminResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await API.get("/results/all");
        setResults(res.data);
      } catch (err) {
        console.error("Error fetching admin results:", err);
      }
    };
    fetchResults();
  }, []);

  if (!results.length) return <p className="p-5">No results found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">All Students Results</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Student</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Exam</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Percentage</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r) => (
            <tr key={r._id}>
              <td className="border p-2">{r.userId?.name}</td>
              <td className="border p-2">{r.userId?.email}</td>
              <td className="border p-2">{r.examId?.title}</td>
              <td className="border p-2">{r.score}/{r.total}</td>
              <td className="border p-2">{r.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminResults;
