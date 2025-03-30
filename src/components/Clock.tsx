import { useState, useRef } from "react";

const Clock = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Stopwatch</h1>
      <p className="text-2xl font-mono"> {time} s</p>

      {/* buttons */}
      <div className="mt-4 flex space-x-4">
        <button
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          onClick={startTimer}
        >
          Start
        </button>
        <button
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          onClick={stopTimer}
        >
          Stop
        </button>
        <button
          className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Clock;
