import { useState } from "react";
import axios from "axios";

const ExamCreator = () => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    date: "",
    duration: "",
  });

  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/exams", formData);
      setMessage("✅ Exam created successfully!");
      console.log(res.data);
      setFormData({ title: "", subject: "", date: "", duration: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create exam.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Exam</h1>

      {message && (
        <p className="mb-4 text-center font-medium text-green-600">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Subject:</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Date:</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Duration (minutes):</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          Create Exam
        </button>
      </form>
    </div>
  );
};

export default ExamCreator;
