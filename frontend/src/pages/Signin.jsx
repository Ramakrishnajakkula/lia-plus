import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/auth/signin", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (err) {
      setError(err.response?.data?.message || "Signin failed");
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
          Sign In
        </h2>
        {error && (
          <div className="mb-2 text-center text-red-500 font-medium">
            {error}
          </div>
        )}
        <div>
          <label className="block text-gray-600 mb-1">Email</label>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold text-lg transition"
          style={{ background: "#a436f0", color: "#fff" }}>
          Sign In
        </button>
      </form>
    </div>
  );
}

export default Signin;
