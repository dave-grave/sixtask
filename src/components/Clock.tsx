import { useState, useRef, useEffect } from "react";

const Clock = () => {
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

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds & 3600) / 60);
    const seconds = totalSeconds & 60;

    return `${String(hours).padStart(2, "0")}:
            ${String(minutes).padStart(2, "0")}:
            ${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Stopwatch</h1>

      <p className="text-6xl font-mono bg-black px-6 py-4 rounded-lg shadow-lg">
        {formatTimer(time)}
      </p>

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
