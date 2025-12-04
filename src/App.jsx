import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ExamList from "./pages/ExamList.jsx";
import TakeExam from "./pages/TakeExam.jsx";
import ExamCreator from "./pages/ExamCreator.jsx";
import QuestionCreator from "./pages/QuestionCreator.jsx";
import ExamDetails from "./pages/ExamDetails.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import Result from "./pages/Result.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx"; // ✅ Correct folder
import { logout } from "./utils/auth.js"; // ✅ Add this file (Step below)


export default function App() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "";

  
  const hideHeader = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {!hideHeader && (
        <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Online Assessment Platform — Exams Conducted Here!
          </h1>
          <nav className="space-x-4">
            {!token ? (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Register</Link>
              </>
            ) : (
              <>
                <Link to="/" className="hover:underline">Home</Link>
                <Link to="/exams" className="hover:underline">Exams</Link>
                {role === "admin" && (
                  <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                )}
                {token && (
                  <span className="ml-4 text-sm text-gray-200">
                    Welcome, <span className="font-semibold">{userName}</span> ({role})
                  </span>
                )}

                <button
                  onClick={logout}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 ml-2"
                >
                  Logout
                </button>

              </>
            )}
          </nav>
        </header>
      )}

      <main className="p-6">
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Admin Routes */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute allowedRoles={["admin"]}>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/create-exam"
    element={
      <ProtectedRoute allowedRoles={["admin"]}>
        <ExamCreator />
      </ProtectedRoute>
    }
  />
  <Route
    path="/add-question"
    element={
      <ProtectedRoute allowedRoles={["admin"]}>
        <QuestionCreator />
      </ProtectedRoute>
    }
  />


  <Route
    path="/exams"
    element={
      <ProtectedRoute allowedRoles={["student", "admin"]}>
        <ExamList />
      </ProtectedRoute>
    }
  />
  <Route
      path="/exam/:examId"
    element={
      <ProtectedRoute allowedRoles={["student", "admin"]}>
        <TakeExam />
      </ProtectedRoute>
    }
  />

  
  <Route
    path="/exam-details/:examId"
    element={
      <ProtectedRoute allowedRoles={["student", "admin"]}>
        <ExamDetails />
      </ProtectedRoute>
    }
  />

  <Route path="/result" element={<ResultPage />} />
  <Route path="/result-summary" element={<Result />} />
</Routes>

      </main>
    </div>
  );
}
