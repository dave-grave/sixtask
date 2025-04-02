import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskPage from "./components/TaskPage";
import TimerSelector from "./components/TimeSelector";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/">Tasks</Link>
          <Link to="/timer">Timer</Link>
        </nav>
        <Routes>
          <Route path="/" element={<TaskPage />} />
          <Route path="/timer" element={<TimerSelector />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
