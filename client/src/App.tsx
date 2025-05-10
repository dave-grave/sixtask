import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/spotify/Login";
import Dashboard from "./components/spotify/Dashboard";
import TaskPage from "./components/TaskPage";
import TimerSelector from "./components/clock/TimeSelector";
import FileExplorer from "./FileExplorer";

function App() {
  // get user's authentication code from spotify
  const code = new URLSearchParams(window.location.search).get("code");

  // return code ? <Dashboard code={code} /> : <Login />;

  return (
    <div className="flex h-screen bg-blue-300 items-center">
      <div className="flex items-center justify-center bg-green-500">
        <TimerSelector />
      </div>
      <div className="flex grow items-center justify-center bg-blue-600">
        <TaskPage />
      </div>
      <div className="flex h-1/2 w-1/4 bg-red-500 items-center justify-center overflow-y-auto">
        {code ? <Dashboard code={code} /> : <Login />}
      </div>
    </div>

    // <BrowserRouter>
    //   <div>
    //     <nav className="flex justify-center space-between gap-8">
    //       <Link to="/">Tasks</Link>
    //       <Link to="/timer">Timer</Link>
    //       {/* conditionally display Dashboard or Login link */}
    //       {code ? (
    //         <Link to="/dashboard">Dashboard</Link>
    //       ) : (
    //         <Link to="/login">Login</Link>
    //       )}
    //       <Link to="/files">Files</Link>
    //     </nav>
    //   </div>
    //   <Routes>
    //     <Route path="/" element={<TaskPage />} />
    //     <Route path="/timer" element={<TimerSelector />} />
    //     <Route path="/dashboard" element={<Dashboard code={code} />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/files" element={<FileExplorer />} />

    //     {/* fallback route */}
    //     <Route path="*" element={<Login />} />
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;
