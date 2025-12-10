import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      {/* Left Logo */}
      <Link to="/" className="text-xl font-bold">
        Exam Portal
      </Link>

      {/* Right Menu */}
      <div className="flex items-center space-x-4">
        <Link to="/exams" className="hover:text-gray-200">
          Exams
        </Link>

        {user ? (
          <>
            {/* Only visible when LOGGED IN */}
            <Link to="/my-results" className="hover:text-gray-200">
              My Results
            </Link>

            <span className="text-yellow-300">
              {user?.name}
            </span>

            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Only visible when NOT logged in */}
            <Link to="/login" className="hover:text-gray-200">
              Login
            </Link>

            <Link
              to="/register"
              className="bg-green-500 px-3 py-1 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
