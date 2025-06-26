import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus, FiChevronDown, FiChevronUp } from "react-icons/fi";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [expandedCard, setExpandedCard] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [filter, setFilter] = useState("all");
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
      setExpandedCard(null);
    } catch {
      setError("Delete failed");
    }
  };

  const toggleExpandCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredExpenses = sortedExpenses.filter((exp) => {
    if (filter === "all") return true;
    return exp.type === filter;
  });

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col items-center min-h-[70vh] bg-gray-50 p-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Your Expenses
            </h2>
            <div className="flex items-center gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
              <Link
                to="/expenses/add"
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
              >
                <FiPlus size={18} />
                <span className="hidden sm:inline">Add Expense</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </div>
          </div>

          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

          {isMobile ? (
            // Enhanced Mobile Card View
            <div className="space-y-3">
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No expenses found. Add your first expense!
                </div>
              ) : (
                filteredExpenses.map((exp) => (
                  <div
                    key={exp._id}
                    className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                      expandedCard === exp._id ? "shadow-md" : "shadow-sm"
                    }`}
                  >
                    <div 
                      className="p-3 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleExpandCard(exp._id)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            exp.type === "income"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {exp.category?.charAt(0).toUpperCase() || "E"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {exp.category}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {formatDate(exp.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            exp.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ₹{exp.amount}
                        </span>
                        {expandedCard === exp._id ? (
                          <FiChevronUp className="text-gray-500" />
                        ) : (
                          <FiChevronDown className="text-gray-500" />
                        )}
                      </div>
                    </div>

                    {expandedCard === exp._id && (
                      <div className="px-3 pb-3 pt-1 border-t bg-gray-50">
                        <div className="mb-2">
                          <p className="text-sm text-gray-700">
                            {exp.description || "No description"}
                          </p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/expenses/edit/${exp._id}`}
                            className="flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition text-sm"
                          >
                            <FiEdit2 size={14} />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(exp._id)}
                            className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                          >
                            <FiTrash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            // Enhanced Desktop Table View
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("category")}
                    >
                      Category
                      {sortConfig.key === "category" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      Amount
                      {sortConfig.key === "amount" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      Date
                      {sortConfig.key === "date" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.map((exp) => (
                    <tr key={exp._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                              exp.type === "income"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {exp.category?.charAt(0).toUpperCase() || "E"}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">
                              {exp.category}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {exp.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap font-bold ${
                          exp.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ₹{exp.amount}
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate">
                        {exp.description || "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(exp.date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            to={`/expenses/edit/${exp._id}`}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-900"
                          >
                            <FiEdit2 size={14} />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(exp._id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredExpenses.length === 0 && (
                <div className="text-center py-8 text-gray-500 bg-white">
                  No expenses match your filters.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Expenses;