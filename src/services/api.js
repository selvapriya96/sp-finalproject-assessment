import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
});

// === Exams ===
export const getExams = () => API.get("/exams");
export const createExam = (examData) => API.post("/exams", examData);

// === Questions ===
export const getQuestionsByExam = (examId) => API.get(`/questions/${examId}`);
export const createQuestion = (questionData) => API.post("/questions", questionData);
