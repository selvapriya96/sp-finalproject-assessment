import React, { useEffect, useState } from "react";
import API from "../api/axios.js";

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState({ title: "", subject: "", date: "", duration: "" });
  const [message, setMessage] = useState("");

  // 🟢 Fetch exams on load
  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await API.get("/exams");
      setExams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🟢 Add exam
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/exams", form);
      setMessage(res.data.message);
      setForm({ title: "", subject: "", date: "", duration: "" });
      fetchExams(); // reload list
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding exam");
    }
  };

  // 🟢 Delete exam
  const handleDelete = async (id) => {
    try {
      await API.delete(`/exams/${id}`);
      fetchExams();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-center">Exam Dashboard</h1>

      {/* Add Exam Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6 grid grid-cols-2 gap-3">
        <input
          type="text"
          name="title"
          placeholder="Exam Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (mins)"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded">
          Add Exam
        </button>
      </form>

      {message && <p className="text-center text-green-600 mb-4">{message}</p>}

      {/* Exam List */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Duration</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam._id}>
              <td className="p-2 border">{exam.title}</td>
              <td className="p-2 border">{exam.subject}</td>
              <td className="p-2 border">{exam.date?.slice(0, 10)}</td>
              <td className="p-2 border">{exam.duration} mins</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => handleDelete(exam._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {exams.length === 0 && (
            <tr>
              <td colSpan="5" className="p-3 text-center text-gray-500">
                No exams found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
