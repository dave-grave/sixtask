import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskPage from "./components/TaskPage";
import TimerSelector from "./components/TimeSelector";
import Callback from "./components/Callback";
import SpotifyPlayerPage from "./components/SpotifyPlayerPage";
import Login from "./components/Login";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/">Tasks</Link>
          <Link to="/timer">Timer</Link>
          <Link to="/spotify">spotify</Link>
          {/* <Link to="/callback">callback</Link> */}
        </nav>
        <Routes>
          <Route path="/" element={<TaskPage />} />
          <Route path="/timer" element={<TimerSelector />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/spotify" element={<SpotifyPlayerPage />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
