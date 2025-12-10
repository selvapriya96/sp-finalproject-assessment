import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";

import ExamPage from "./pages/ExamPage";
import Result from "./pages/Result";
import ResultReview from "./pages/ResultReview";
import AdminResults from "./pages/AdminResults";
import AdminDashboard from "./pages/AdminDashboard";
import MyResults from "./pages/MyResults";
import Exams from "./pages/Exam";
import Login from "./pages/Login";
import Register from "./pages/Register";
import home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      
        <Route
          path="/exams"
          element={
            <ProtectedRoute>
              <Exams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:id"
          element={
            <ProtectedRoute>
              <ExamPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-results"
          element={
            <ProtectedRoute>
              <MyResults />
            </ProtectedRoute>
          }
        />

       
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/result-review"
          element={
            <ProtectedRoute>
              <ResultReview />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<p>Page not found</p>} />
  <Route path="/" element={<Home />} />
        <Route path="/unauthorized" element={<p>You are not allowed here.</p>} />
      </Routes>
    </>
  );
}

export default App;
