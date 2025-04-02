import { useState, useRef, useEffect } from "react";
import { formatTime } from "../../utils";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(300);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = () => {
    if (!running && timeLeft > 0) {
      setRunning(true);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
  };

  const stopCountdown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setRunning(false);
    }
  };

  const resetCountdown = () => {
    stopCountdown();
    setTimeLeft(300);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl mb-4">Countdown Timer</h2>
      <p className="text-5xl">{formatTime(timeLeft)}</p>

      <div className="mt-4 flex space-x-5">
        <button
          className="bg-green-500 px-6 py-3 rounded-lg shadow-md text-lg font-semibold
           hover:bg-green-600 transition duration-200"
          onClick={startCountdown}
        >
          Start
        </button>
        <button
          className="bg-red-500 px-6 py-3 rounded-lg shadow-md text-lg font-semibold 
          hover:bg-red-600 transition duration-200"
          onClick={stopCountdown}
        >
          Stop
        </button>
        <button
          className="bg-gray-500 px-6 py-3 rounded-lg shadow-md text-lg font-semibold
           hover:bg-gray-600 transition duration-200"
          onClick={resetCountdown}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Countdown;
