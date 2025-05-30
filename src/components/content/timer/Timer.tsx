"use client";

import React, { useEffect, useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import TimerChildren from "./TimerChildren";
import { useTimerContext } from "@/app/context/TimerContext";
import { TimerType } from "@/types";

const timerProps = {
  size: 300,
  strokeWidth: 12,
};

export default function Timer() {
  // clock variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(900);
  const [timerKey, setTimerKey] = useState(0);

  // track elapsed time using a stopwatch
  const [stopwatch, setStopwatch] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // pass into timerchildren

  function formatTimeString(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  }

  // update stopwatch
  useEffect(() => {
    if (!isEditing && isPlaying) {
      const interval = setInterval(() => {
        setStopwatch((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isEditing, isPlaying]);

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

  // set timer context to supabase
  const { getTimer, insertTimer } = useTimerContext();
  const [timer, setTimer] = useState<TimerType | null>(null);

  useEffect(() => {
    const fetchTimer = async () => {
      // insert default timer if it does not already exist in db (first sign-on)
      await insertTimer();

      const timerData = await getTimer();
      setTimer(timerData);
    };
    fetchTimer();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="p-2 text-center text-lg">
        {mode === "study" ? `Study Time ${numStudy}` : `Break Time ${numBreak}`}
      </p>
      <p className="p-2 text-center text-lg">
        Time Elapsed: {formatTimeString(stopwatch)}
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
        {({ remainingTime }) => {
          return (
            <TimerChildren
              remainingTime={remainingTime}
              setIsPlaying={setIsPlaying}
              duration={duration}
              setDuration={setDuration}
              setTimerKey={setTimerKey}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          );
        }}
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
