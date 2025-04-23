import { useState, useRef, useEffect } from "react";
import { formatTime } from "../../utils";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (!running) {
      setRunning(true);
      timerRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setRunning(false);
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTime(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-4">
      <div className="flex justify-center space-between gap-8">
        {/* <Router>
          <button>
            <div className="app">
              <nav>
                <Link to="/">Home</Link>
              </nav>
            </div>
          </button>
        </Router> */}
        {/* <p>second</p> */}
      </div>
      <h1 className="text-5xl font-bold mb-6 text-blue-400">Stopwatch</h1>

      <p className="text-6xl font-mono bg-black px-6 py-4 rounded-lg shadow-lg">
        {formatTime(time)}
      </p>

      {/* buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          className="bg-green-500 px-6 py-3 rounded-lg shadow-md text-lg font-semibold
           hover:bg-green-600 transition duration-200"
          onClick={startTimer}
        >
          Start
        </button>
        <button
          className="bg-red-500 px-6 py-3 rounded-lg shadow-md text-lg font-semibold 
          hover:bg-red-600 transition duration-200"
          onClick={stopTimer}
        >
          Stop
        </button>
        <button
          className="bg-gray-500 px-6 py-3 rounded-lg shadow-md text-lg font-semibold
           hover:bg-gray-600 transition duration-200"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;
