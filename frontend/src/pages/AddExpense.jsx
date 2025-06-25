import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddExpense() {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
    type: "expense",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(
        "http://localhost:5000/expenses",
        { ...form, amount: Number(form.amount) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/expenses");
    } catch (err) {
      setError(err.response?.data?.message || "Add failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gradient-to-br ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl px-8 py-10 space-y-6">
        <h2
          className="text-3xl font-bold mb-2 text-center"
          style={{ color: "#a436f0" }}>
          Add Income / Expense
        </h2>
        {error && (
          <div className="mb-2 text-center text-red-500 font-medium">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              form.type === "expense"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setForm({ ...form, type: "expense" })}>
            Expense
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              form.type === "income"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setForm({ ...form, type: "income" })}>
            Income
          </button>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Amount</label>
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            style={{ borderColor: "#a436f0" }}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Category</label>
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            style={{ borderColor: "#a436f0" }}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Description</label>
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            style={{ borderColor: "#a436f0" }}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Date</label>
          <input
            name="date"
            type="date"
            placeholder="Date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            style={{ borderColor: "#a436f0" }}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold text-lg transition"
          style={{ background: "#a436f0", color: "#fff" }}>
          Add
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
