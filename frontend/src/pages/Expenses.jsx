import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, {
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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    fetchExpenses();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/expenses/${id}`, {
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
    <div className="flex flex-col items-center min-h-[70vh] bg-gradient-to-br">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">
            Your Expenses
          </h2>
          <Link
            to="/expenses/add"
            className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
          >
            + Add Expense
          </Link>
        </div>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        {isMobile ? (
          // Mobile Card View
          <div className="space-y-4">
            {expenses.length === 0 && (
              <div className="text-center py-6 text-gray-400">
                No expenses found.
              </div>
            )}
            {expenses.map((exp) => (
              <div
                key={exp._id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        exp.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {exp.type
                        ? exp.type.charAt(0).toUpperCase() + exp.type.slice(1)
                        : "Expense"}
                    </span>
                    <h3 className="font-bold text-lg mt-1">₹ {exp.amount}</h3>
                  </div>
                  <div className="text-sm text-gray-500">
                    {exp.date ? new Date(exp.date).toLocaleDateString() : ""}
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm font-medium text-gray-700">
                    {exp.category}
                  </div>
                  {exp.description && (
                    <div className="text-sm text-gray-600 mt-1">
                      {exp.description}
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <Link
                    to={`/expenses/edit/${exp._id}`}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop Table View
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-blue-50 text-blue-700">
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
                    className="border-b last:border-b-0 hover:bg-blue-50 transition"
                  >
                    <td className="py-2 px-4 font-semibold">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          exp.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
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
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;