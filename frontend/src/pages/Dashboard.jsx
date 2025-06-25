import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const intervalRef = useRef();

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setExpenses(res.data);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching expenses:", err);
    }
  };

  const filterByDate = (exp) => {
    if (filter === "all") return true;

    const expDate = new Date(exp.date);
    const now = new Date();

    switch (filter) {
      case "weekly":
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return expDate >= weekAgo && expDate <= now;
      case "monthly":
        return (
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      case "yearly":
        return expDate.getFullYear() === now.getFullYear();
      case "custom":
        if (!dateRange.from || !dateRange.to) return true;
        const from = new Date(dateRange.from);
        const to = new Date(dateRange.to);
        return expDate >= from && expDate <= to;
      default:
        return true;
    }
  };

  useEffect(() => {
    fetchExpenses();
    intervalRef.current = setInterval(fetchExpenses, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const filteredExpenses = expenses.filter(filterByDate);

  // Calculate financial summaries
  const { totalIncome, totalExpense, balance } = filteredExpenses.reduce(
    (acc, exp) => {
      if (exp.type === "income") acc.totalIncome += exp.amount;
      if (exp.type === "expense") acc.totalExpense += exp.amount;
      acc.balance = acc.totalIncome - acc.totalExpense;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, balance: 0 }
  );

  // Prepare chart data
  const chartCategories = [...new Set(filteredExpenses.map((e) => e.category))];
  const chartData = {
    labels: chartCategories,
    datasets: [
      {
        label: "Income",
        data: chartCategories.map((cat) =>
          filteredExpenses
            .filter((e) => e.category === cat && e.type === "income")
            .reduce((sum, e) => sum + e.amount, 0)
        ),
        backgroundColor: "rgba(34, 197, 94, 0.7)",
      },
      {
        label: "Expense",
        data: chartCategories.map((cat) =>
          filteredExpenses
            .filter((e) => e.category === cat && e.type === "expense")
            .reduce((sum, e) => sum + e.amount, 0)
        ),
        backgroundColor: "rgba(239, 68, 68, 0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Income & Expenses by Category",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `₹${context.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  // Recent transactions (last 5)
  const recent = [...filteredExpenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Category summary
  const categorySummary = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Date Filter Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            {["all", "weekly", "monthly", "yearly", "custom"].map((f) => (
              <button
                key={f}
                className={`px-4 py-2 rounded-md font-medium ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            {filter === "custom" && (
              <div className="flex items-center gap-2 ml-2">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                  className="border rounded-md px-3 py-1"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                  className="border rounded-md px-3 py-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SummaryCard
            icon="💰"
            label="Total Income"
            value={totalIncome}
            color="text-green-500"
            trend="up"
          />
          <SummaryCard
            icon="💸"
            label="Total Expense"
            value={totalExpense}
            color="text-red-500"
            trend="down"
          />
          <SummaryCard
            icon="📊"
            label="Balance"
            value={balance}
            color={balance >= 0 ? "text-blue-500" : "text-orange-500"}
            trend={balance >= 0 ? "up" : "down"}
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Income & Expenses Overview
          </h2>
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Category Breakdown
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.entries(categorySummary).map(([category, amount]) => (
              <div
                key={category}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-700 truncate">
                  {category}
                </h3>
                <p className="text-xl font-semibold">
                  ₹{amount.toLocaleString()}
                </p>
              </div>
            ))}
            {Object.keys(categorySummary).length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-400">
                No transactions found
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Transactions
            </h2>
          </div>
          {error && (
            <div className="px-6 py-3 bg-red-50 text-red-600">{error}</div>
          )}
          <div className="divide-y">
            {recent.length > 0 ? (
              recent.map((transaction) => (
                <TransactionItem
                  key={transaction._id}
                  transaction={transaction}
                />
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-400">
                No transactions available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, color, trend }) {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-center">
      <div className={`text-3xl mr-4 ${color}`}>{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold">
          ₹{Math.abs(value).toLocaleString()}
        </p>
      </div>
      {trend && (
        <span
          className={`text-2xl ${
            trend === "up" ? "text-green-500" : "text-red-500"
          }`}>
          {trend === "up" ? "↑" : "↓"}
        </span>
      )}
    </div>
  );
}

function TransactionItem({ transaction }) {
  const isIncome = transaction.type === "income";
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isIncome ? "bg-green-100" : "bg-red-100"
            }`}>
            <span className={isIncome ? "text-green-600" : "text-red-600"}>
              {isIncome ? "↑" : "↓"}
            </span>
          </div>
          <div>
            <h3 className="font-medium">{transaction.description}</h3>
            <p className="text-sm text-gray-500">
              {transaction.category} •{" "}
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div
          className={`font-semibold ${
            isIncome ? "text-green-600" : "text-red-600"
          }`}>
          {isIncome ? "+" : "-"}₹{transaction.amount.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
