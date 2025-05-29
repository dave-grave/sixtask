import React, { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import EditableTime from "./EditableTime";

const timerProps = {
  size: 300,
  strokeWidth: 12,
};

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
};

const parseTime = (str: string): number => {
  const parts = str.split(":").map(Number).reverse();
  let seconds = 0;
  if (parts[0]) seconds += parts[0];
  if (parts[1]) seconds += parts[1] * 60;
  if (parts[2]) seconds += parts[2] * 3600;
  return seconds;
};

export default function Timer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timerKey, setTimerKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [duration, setDuration] = useState(3);
  const [inputValue, setInputValue] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
    setInputValue(formatTime(duration));
    setIsPlaying(false);
  };

  const handleInputChange = (
    field: "hours" | "minutes" | "seconds",
    value: string
  ) => {
    const parts = inputValue.split(":").map((p) => p.padStart(2, "0"));
    while (parts.length < 3) parts.unshift("00");
    const timeObj = {
      hours: parts[0],
      minutes: parts[1],
      seconds: parts[2],
    };

    // Update the relevant field
    timeObj[field] = value.padStart(2, "0");
    setInputValue([timeObj.hours, timeObj.minutes, timeObj.seconds].join(":"));
  };

  const applyDuration = () => {
    const newDuration = parseTime(inputValue);
    setDuration(newDuration);
    setTimerKey((prev) => prev + 1);
    setIsEditing(false);
    setIsPlaying(false);
  };
  const handleInputBlur = () => {
    applyDuration();
  };
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyDuration();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <CountdownCircleTimer
        key={timerKey}
        isPlaying={isPlaying}
        duration={duration}
        colors={["#004777", "#A30000"]}
        colorsTime={[duration, 0]}
        strokeLinecap="round"
        onComplete={() => {
          setIsPlaying(false);
          return { shouldRepeat: false };
        }}
        {...timerProps}
      >
        {({ remainingTime }) => (
          <EditableTime
            remainingTime={remainingTime}
            isEditing={isEditing}
            inputValue={inputValue}
            onEdit={handleEdit}
            onInputChange={handleInputChange}
            onInputBlur={handleInputBlur}
            onInputKeyDown={handleInputKeyDown}
          />
        )}
      </CountdownCircleTimer>

      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {
            setDuration(60);
            setInputValue("00:00:60");
            setIsPlaying(false);
            setTimerKey((prev) => prev + 1);
          }}
        >
          reset
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {
            {
              setIsPlaying((prev) => !prev);
            }
          }}
        >
          {isPlaying ? "pause" : "play"}
        </button>
      </div>
    </div>
  );
}
