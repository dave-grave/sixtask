"use client";

import React, { useEffect, useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import TimerChildren from "./TimerChildren";
import { useTimerContext } from "@/app/context/TimerContext";
import { format } from "date-fns-tz";

const timerProps = {
  size: 300,
  strokeWidth: 12,
};

// TODO: 1. sync up elapsed time with remainingtime, then hide it and push it to supabase instead.
// 2. clock should keep running even if we leave page
// 2b. useref? or something?
// 3. show a loading sign before fading in the clock after db call.
export default function Timer() {
  // const hasInitialized = useRef(false);

  // clock variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(60);
  const [timerKey, setTimerKey] = useState(0);
  const [initialRemainingTime, setInitialRemainingTime] = useState(60);

  // track elapsed time using a stopwatch
  const [elapsedTime, setElapsedTime] = useState(0); // session elapsed time
  const [globalElapsedTime, setGlobalElapsedTime] = useState(0); // global elapsed time from db
  const [isEditing, setIsEditing] = useState(false); // pass into timerchildren

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
  const { getTimer, upsertTimer } = useTimerContext();

  // Track user_id for DB updates
  const userIdRef = useRef<string | null>(null);

  // const [timerData, setTimerData] = useState<TimerType | null>(null);

  // fetch timer data on mount
  useEffect(() => {
    const fetchTimer = async () => {
      // 1. Try to fetch today's timer row
      const data = await getTimer();
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const todayLocal = format(new Date(), "yyyy-MM-dd", {
        timeZone: userTimeZone,
      });

      // 2. Find today's timer row
      const todayTimer = Array.isArray(data)
        ? data.find((row) => row.date === todayLocal)
        : null;

      if (todayTimer) {
        // Use the existing timer data
        // set state from todayTimer...
      } else {
        await upsertTimer({
          isPlaying: false,
          duration: 1500,
          timerKey: 0,
          mode: "study",
          isEditing: false,
          numStudy: 0,
          numBreak: 0,
          elapsedTime: 0,
          initialRemainingTime: 1500,
        });
      }
      // const data = await getTimer();
      const timer = Array.isArray(data) ? data[0] : data;

      // console.log(timer);
      if (timer /* && !hasInitialized.current*/) {
        setIsPlaying(false);
        setDuration(timer.duration ?? 900);
        setInitialRemainingTime(timer.initialRemainingTime ?? duration);
        setTimerKey(timer.timerKey ?? 0);
        setMode(timer.mode ?? "study");
        setNumStudy(timer.numStudy ?? 0);
        setNumBreak(timer.numBreak ?? 0);
        setElapsedTime(0);
        setGlobalElapsedTime(timer.elapsedTime ?? 0);

        userIdRef.current = timer.user_id ?? null;
        // hasInitialized.current = true;
      }
    };
    fetchTimer();
  }, []);

  // save to db on play, pause, reset
  useEffect(() => {
    if (!userIdRef.current) return;
    upsertTimer({
      isPlaying,
      duration,
      timerKey,
      mode,
      isEditing,
      numStudy,
      numBreak,
      elapsedTime: globalElapsedTime + elapsedTime,
      initialRemainingTime: Math.max(duration - elapsedTime, 1),
    });
  }, [duration, elapsedTime]);

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="p-2 text-center text-lg">
        {mode === "study" ? `Study Time ${numStudy}` : `Break Time ${numBreak}`}
      </p>
      <p className="p-2 text-center text-lg">
        Time Elapsed: {elapsedTime}, {globalElapsedTime}
      </p>
      <CountdownCircleTimer
        key={timerKey}
        isPlaying={isPlaying}
        duration={duration}
        onComplete={handleComplete}
        // initialRemainingTime={initialRemainingTime}
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
              timerKey={timerKey}
              setTimerKey={setTimerKey}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              elapsedTime={elapsedTime}
              setElapsedTime={setElapsedTime}
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
