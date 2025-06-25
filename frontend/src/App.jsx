import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import Expenses from "./pages/Expenses.jsx";
import AddExpense from "./pages/AddExpense.jsx";
import EditExpense from "./pages/EditExpense.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import "./App.css";

function RequireAuth({ children }) {
  const isAuthenticated = !!localStorage.getItem("token");
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">
            Please sign in or sign up to continue
          </h2>
          <div className="flex gap-4 justify-center">
            <a
              href="/signin"
              className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">
              Sign In
            </a>
            <a
              href="/signup"
              className="px-4 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    );
  }
  return children;
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Navbar />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/expenses"
              element={
                <RequireAuth>
                  <Expenses />
                </RequireAuth>
              }
            />
            <Route
              path="/expenses/add"
              element={
                <RequireAuth>
                  <AddExpense />
                </RequireAuth>
              }
            />
            <Route
              path="/expenses/edit/:id"
              element={
                <RequireAuth>
                  <EditExpense />
                </RequireAuth>
              }
            />
            {/* Default route: show dashboard */}
            <Route
              path="*"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
