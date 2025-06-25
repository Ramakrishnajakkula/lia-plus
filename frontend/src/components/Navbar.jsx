import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <nav className="bg-white shadow mb-8">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="text-lg font-bold text-blue-600 hover:text-blue-800">
            Dashboard
          </Link>
          <Link
            to="/expenses"
            className="text-lg font-bold text-blue-600 hover:text-blue-800">
            Manage Expenses
          </Link>
          {isAuthenticated && (
            <Link
              to="/expenses/add"
              className="text-lg font-bold text-blue-600 hover:text-blue-800">
              Add Expense
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition">
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/signin"
                className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

// Make sure you have <BrowserRouter> in your App.jsx or App.js wrapping your routes.
// Also, ensure you have at least one valid route that renders a component with visible content.
// If you see a blank page, check the browser console for errors and verify all import paths are correct.
