import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../index.css";

function EditExpense() {
  const { id } = useParams();
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const exp = res.data.find((e) => e._id === id);
        if (exp) setForm({ ...exp, date: exp.date?.slice(0, 10) });
      })
      .catch(() => setError("Failed to load expense"));
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/expenses/${id}`,
        { ...form, amount: Number(form.amount) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/expenses");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Edit Income/Expense
      </h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        required
        className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300">
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
        className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
      />
      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        required
        className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
        className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
      />
      <input
        name="date"
        type="date"
        placeholder="Date"
        value={form.date}
        onChange={handleChange}
        required
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">
        Update
      </button>
    </form>
  );
}

export default EditExpense;
