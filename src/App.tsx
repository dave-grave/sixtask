import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskPage from "./components/TaskPage";
import Clock from "./components/Clock";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/">Tasks</Link>
          <Link to="/clock">Stopwatch</Link>
        </nav>
        <Routes>
          <Route path="/" element={<TaskPage />} />
          <Route path="/clock" element={<Clock />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
