import { useState } from "react";
import Stopwatch from "./clock/Stopwatch";
import Countdown from "./clock/Countdown";
import Pomodoro from "./clock/Pomodoro";
import { formatTime } from "../utils";

const TimerSelector = () => {
  const [activeTimer, setActiveTimer] = useState("stopwatch");

  return (
    <div
      className="flex flex-col items-center justify-center h-screen
        bg-gray-900 text-white p-4"
    >
      <h1 className="text-4xl font-bold mb-6 text-blue-400">Choose Timer </h1>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTimer === "stopwatch" ? "bg-blue-500" : "bg-gray-700"
          }`}
          onClick={() => setActiveTimer("stopwatch")}
        >
          Stopwatch
        </button>

        <button
          className={`px-4 py-2 rounded-lg ${
            activeTimer === "stopwatch" ? "bg-blue-500" : "bg-gray-700"
          }`}
          onClick={() => setActiveTimer("countdown")}
        >
          Countdown
        </button>

        <button
          className={`px-4 py-2 rounded-lg ${
            activeTimer === "stopwatch" ? "bg-blue-500" : "bg-gray-700"
          }`}
          onClick={() => setActiveTimer("pomodoro")}
        >
          Pomodoro
        </button>
      </div>

      {activeTimer === "stopwatch" && <Stopwatch />}
      {activeTimer === "countdown" && <Countdown />}
      {activeTimer === "pomodoro" && <Pomodoro />}
    </div>
  );
};

export default TimerSelector;
