import React, { useEffect, useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import TimerChildren from "./TimerChildren";

const timerProps = {
  size: 300,
  strokeWidth: 12,
};

export default function Timer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(3661);
  const [timerKey, setTimerKey] = useState(0);

  // variables to track study mode
  const [mode, setMode] = useState<"study" | "break">("study");
  const [numStudy, setNumStudy] = useState(0);
  const [numBreak, setNumBreak] = useState(0);
  const studyDuration = 1500;
  const breakDuration = 300;

  // TODO: add a "reset" state to animate the progress bar
  // going all the way back up the opposite direction
  const handleComplete = () => {
    if (mode === "study") {
      setMode("break");
      setDuration(breakDuration);
      setNumStudy((prev) => prev + 1);
    } else {
      setMode("study");
      setDuration(studyDuration);
      setNumBreak((prev) => prev + 1);
    }
    setTimerKey((prev) => prev + 1);
    setIsPlaying(true);
    return { shouldRepeat: false };
  };

  // play/pause button
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // update timer key to allow timer reset
  const handleReset = () => {
    setIsPlaying(false);
    setDuration(duration);
    setTimerKey((prev) => prev + 1);
  };

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  // text that goes in the middle of the timer circle
  const children = ({ remainingTime }: { remainingTime: number }) => {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    const handleEditTime = () => {
      setIsEditing(true);
      setIsPlaying(false);
      inputRef?.current?.focus();
      console.log(inputRef);
    };

    const handleUneditTime = () => {
      setIsEditing(false);
    };

    return (
      // parse into hh:mm:ss format with enforced 2 digits
      <span
        className="flex flex-col items-center hover:cursor-pointer font-bold text-2xl"
        onClick={handleEditTime}
        onBlur={handleUneditTime}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            className="border border-gray-300 rounded w-1/2"
          />
        ) : (
          [
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0"),
          ].join(":")
        )}
      </span>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="p-2 text-center text-lg">
        {mode === "study" ? `Study Time ${numStudy}` : `Break Time ${numBreak}`}
      </p>
      <CountdownCircleTimer
        key={timerKey}
        isPlaying={isPlaying}
        duration={duration}
        onComplete={handleComplete}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[duration, (duration * 2) / 3, duration / 3, 0]}
        {...timerProps}
      >
        {({ remainingTime }) => (
          <TimerChildren
            remainingTime={remainingTime}
            setIsPlaying={setIsPlaying}
            duration={duration}
            setDuration={setDuration}
            setTimerKey={setTimerKey}
          />
        )}
      </CountdownCircleTimer>

      <button
        className="mt-2 bg-blue-600 rounded px-4 py-2 text-white font-bold"
        onClick={handlePlayPause}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <button
        className="mt-2 bg-red-600 rounded px-4 py-2 text-white font-bold"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
}
