import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import Navbar from "./components/Navbar";
import './index.css';

function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/expenses"
          element={isAuthenticated ? <Expenses /> : <Navigate to="/signin" />}
        />
        <Route
          path="/expenses/add"
          element={isAuthenticated ? <AddExpense /> : <Navigate to="/signin" />}
        />
        <Route
          path="/expenses/edit/:id"
          element={isAuthenticated ? <EditExpense /> : <Navigate to="/signin" />}
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/expenses" : "/signin"} />} />
      </Routes>
    </Router>
  );
}

export default App;
