import { useState, useRef, useEffect } from "react";
import { formatTime, createTimer } from "../../utils";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(300);
  const [running, setRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = () => {
    if (!running && timeLeft > 0) {
      setRunning(true);
      timerRef.current = createTimer(timeLeft, setTimeLeft, () =>
        setRunning(false)
      );
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

  const applyCustomTime = () => {
    const minutes = parseInt(customMinutes, 10);
    if (!isNaN(minutes) && minutes > 0) {
      setTimeLeft(minutes * 60);
      setCustomMinutes("");
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl mb-4">Countdown Timer</h2>
      <p className="text-5xl">{formatTime(timeLeft)}</p>

      <div className="mt-4 flex justify-center space-x-2">
        <input
          type="number"
          placeholder="Minutes"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(e.target.value)}
          className="p-2 border rounded-md w-20 text-white"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={applyCustomTime}
        >
          Set Time
        </button>
      </div>

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
