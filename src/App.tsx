import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import TaskPage from "./components/TaskPage";
import TimerSelector from "./components/TimeSelector";
import Callback from "./components/Callback";
import SpotifyPlayerPage from "./components/SpotifyPlayerPage";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("spotifyAccessToken")
  );

  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem("spotifyAccessToken");
      setToken(storedToken);
    };

    checkToken();

    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/">Tasks</Link>
          <Link to="/timer">Timer</Link>
          <Link to="/spotify">spotify</Link>
          <Link to="/login">login</Link>
          {token && (
            <span className="ml-4 text-green-400"> Spotify Connected</span>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<TaskPage />} />
          <Route path="/timer" element={<TimerSelector />} />
          <Route path="/callback" element={<Callback />} />
          <Route
            path="/spotify"
            element={token ? <SpotifyPlayerPage /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
