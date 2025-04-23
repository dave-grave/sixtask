import { useState, useRef, useEffect } from "react";
import { formatTime, createTimer } from "../../utils";

const WORK_DURATION = 3; /* * 60*/
const BREAK_DURATION = 5; /* * 60*/

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [running, setRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPomodoro = () => {
    if (!running) {
      setRunning(true);
      console.log("running");
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
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
    setTimeLeft(WORK_DURATION);
    setIsWorkSession(true);
    setCycleCount(0);
  };

  const handleTimerEnd = () => {
    stopPomodoro();
    const temp = !isWorkSession;
    setIsWorkSession(temp);
    setTimeLeft(temp ? WORK_DURATION : BREAK_DURATION);

    if (temp) {
      setCycleCount((prev) => prev + 1);
    }
  };

  // clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // // start timer when session changes
  // useEffect(() => {
  //   if (running) {
  //     startPomodoro();
  //   }
  // }, [isWorkSession]);

  return (
    <div className="text-center">
      <h2 className="text-2xl mb-4">{isWorkSession ? "Work time" : "break"}</h2>
      <p className="text-5xl">{formatTime(timeLeft)}</p>
      <p className="mt-2 text-lg">Cycles Completed: {cycleCount}</p>

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
