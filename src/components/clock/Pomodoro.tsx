import { useState, useRef, useEffect } from "react";
import { formatTime } from "../../utils";

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startPomodoro = () => {
    if (!running) {
      setRunning(true);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) return prev - 1;
          else {
            setOnBreak(!onBreak);
            return onBreak ? 25 * 60 : 5 * 60;
          }
        });
      }, 1000);
    }
  };

  const stopPomodoro = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setRunning(false);
    }
  };

  const resetPomodoro = () => {
    stopPomodoro();
    setOnBreak(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl mb-4">{onBreak ? "Break" : "Pomodoro"}</h2>
      <p className="text-5xl">{formatTime(timeLeft)}</p>
      <div className="mt-4 flex space-x-4">
        <button
          className="bg-green-500 px-6 py-3 rounded-lg shadow-md text-lg font-semibold
           hover:bg-green-600 transition duration-200"
          onClick={startPomodoro}
        >
          Start
        </button>
        <button
          className="bg-red-500 px-6 py-3 rounded-lg shadow-md text-lg font-semibold 
          hover:bg-red-600 transition duration-200"
          onClick={stopPomodoro}
        >
          Stop
        </button>
        <button
          className="bg-gray-500 px-6 py-3 rounded-lg shadow-md text-lg font-semibold
           hover:bg-gray-600 transition duration-200"
          onClick={resetPomodoro}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Pomodoro;
