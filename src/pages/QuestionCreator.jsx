import { useState, useEffect } from "react";
import API from "../api/axios.js"; 

const QuestionCreator = () => {
  const [exams, setExams] = useState([]);
  const [formData, setFormData] = useState({
    examId: "",
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });
  const [message, setMessage] = useState("");

  // Fetch all exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await API.get("/exams");
        setExams(res.data || []);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
      }
    };
    fetchExams();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📦 Sending data to backend:", formData);

    try {
      await API.post("/questions", formData);
      setMessage("✅ Question added successfully!");
      setFormData({
        examId: "",
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
    } catch (err) {
      console.error("Failed to add question:", err);
      setMessage("❌ Failed to add question.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Add Question</h1>

      {message && <p className="mb-4 text-center text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Exam Select */}
        <div>
          <label className="block text-gray-700">Select Exam:</label>
          <select
            name="examId"
            value={formData.examId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Choose Exam --</option>
            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.title}
              </option>
            ))}
          </select>
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-gray-700">Question:</label>
          <input
            type="text"
            name="questionText"
            value={formData.questionText} // fixed typo here
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Options */}
        {formData.options.map((opt, idx) => (
          <div key={idx}>
            <label className="block text-gray-700">Option {idx + 1}:</label>
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        ))}

        {/* Correct Answer */}
        <div>
          <label className="block text-gray-700">Correct Answer:</label>
          <input
            type="text"
            name="correctAnswer"
            value={formData.correctAnswer}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Question
        </button>
      </form>
    </div>
  );
};

export default QuestionCreator;
