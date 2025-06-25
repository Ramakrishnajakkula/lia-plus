import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/expenses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setExpenses(res.data);
    } catch (err) {
      setError("Failed to fetch expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await axios.delete(`http://localhost:5000/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[70vh] bg-gradient-to-br ">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold" style={{ color: "#a436f0" }}>
            Your Expenses
          </h2>
          <Link
            to="/expenses/add"
            className="inline-block px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            style={{ background: "#a436f0", color: "#fff" }}>
            + Add Expense
          </Link>
        </div>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr style={{ background: "#f3e8fd", color: "#a436f0" }}>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    No expenses found.
                  </td>
                </tr>
              )}
              {expenses.map((exp) => (
                <tr
                  key={exp._id}
                  className="border-b last:border-b-0 hover:bg-blue-50 transition">
                  <td className="py-2 px-4 font-semibold">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        exp.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                      {exp.type
                        ? exp.type.charAt(0).toUpperCase() + exp.type.slice(1)
                        : "Expense"}
                    </span>
                  </td>
                  <td className="py-2 px-4 font-bold text-gray-800">
                    ₹ {exp.amount}
                  </td>
                  <td className="py-2 px-4">{exp.category}</td>
                  <td className="py-2 px-4">{exp.description}</td>
                  <td className="py-2 px-4">
                    {exp.date ? new Date(exp.date).toLocaleDateString() : ""}
                  </td>
                  <td className="py-2 px-4 flex gap-2 justify-center">
                    <Link
                      to={`/expenses/edit/${exp._id}`}
                      className="px-3 py-1 rounded font-semibold"
                      style={{ background: "#f59e42", color: "#fff" }}>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="px-3 py-1 rounded font-semibold"
                      style={{ background: "#ef4444", color: "#fff" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Expenses;

// Make sure you have imported Tailwind's CSS in your main entry file (usually main.jsx or index.js):
// import "../index.css";
// Also, ensure your tailwind.config.js content includes: "./src/**/*.{js,jsx,ts,tsx}"
// And that you are running the dev server with `npm run dev` or `npm start`.
