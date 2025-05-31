import React, { useState, useEffect, useRef } from "react";

// helper to format seconds as hh:mm:ss object
function formatTimeObj(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };
}

// helper to parse hh:mm:ss string into seconds
function parseTimeObj(time: {
  hours: string;
  minutes: string;
  seconds: string;
}) {
  const h = Number(time.hours) || 0;
  const m = Number(time.minutes) || 0;
  const s = Number(time.seconds) || 0;
  return s + m * 60 + h * 3600;
}

export default function TimerChildren({
  remainingTime,
  setIsPlaying,
  duration,
  setDuration,
  timerKey,
  setTimerKey,
  isEditing,
  setIsEditing,
  elapsedTime,
  setElapsedTime,
}: {
  remainingTime: number;
  setIsPlaying: (state: boolean) => void;
  duration: number;
  setDuration: (duration: number) => void;
  timerKey: number;
  setTimerKey: React.Dispatch<React.SetStateAction<number>>;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  elapsedTime: number;
  setElapsedTime: (val: any) => void;
}) {
  const [inputValue, setInputValue] = useState(formatTimeObj(duration));
  const prevInputValue = useRef<{
    hours: string;
    minutes: string;
    seconds: string;
  } | null>(null);

  // input refs
  const hourRef = useRef<HTMLInputElement>(null);
  const minRef = useRef<HTMLInputElement>(null);
  const secRef = useRef<HTMLInputElement>(null);
  const blurTimeout = useRef<NodeJS.Timeout | null>(null);

  // handle when user clicks off editing timer
  const handleInputBlur = () => {
    blurTimeout.current = setTimeout(() => {
      if (
        document.activeElement !== hourRef.current &&
        document.activeElement !== minRef.current &&
        document.activeElement !== secRef.current
      ) {
        applyInput();
      }
    }, 10);
  };

  // handle user clicks to edit timer
  const handleInputFocus = (field: "hours" | "minutes" | "seconds") => {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
      blurTimeout.current = null;
    }
    if (field === "hours" && hourRef.current) hourRef.current.select();
    if (field === "minutes" && minRef.current) minRef.current.select();
    if (field === "seconds" && secRef.current) secRef.current.select();
  };

  // default focus the hour input entering edit mode
  useEffect(() => {
    if (isEditing && hourRef.current) {
      hourRef.current.focus();
      hourRef.current.select();
    }
  }, [isEditing]);

  // update inputValue if leave edit mode or if timer ticks
  useEffect(() => {
    if (!isEditing) {
      setInputValue(formatTimeObj(remainingTime));
    }
  }, [remainingTime, isEditing]);

  const handleInputEdit = () => {
    setIsEditing(true);
    setIsPlaying(false);
    prevInputValue.current = { ...inputValue };
  };

  const handleInputChange = (
    field: "hours" | "minutes" | "seconds",
    value: string
  ) => {
    // Only allow numbers, max 2 digits
    if (!/^\d{0,2}$/.test(value)) return;
    setInputValue((prev) => ({ ...prev, [field]: value }));

    if (value.length === 2) {
      if (field === "hours" && minRef.current) {
        minRef.current.focus();
        minRef.current.select();
      }
      if (field === "minutes" && secRef.current) {
        secRef.current.focus();
        secRef.current.select();
      }
    }
  };

  // update duration when input changes
  const applyInput = () => {
    // if input hasn't changed, treat like pausing the clock.
    const prev = prevInputValue.current;
    const curr = inputValue;
    const unchanged =
      prev &&
      prev.hours === curr.hours &&
      prev.minutes === curr.minutes &&
      prev.seconds === curr.seconds;
    if (unchanged) {
      setIsEditing(false);
      return;
    }

    // otherwise, reset the clock progress bar.
    const newDuration = parseTimeObj(inputValue);
    if (newDuration > 0) {
      setDuration(newDuration);
      setTimerKey((prev) => prev + 1);
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "hours" | "minutes" | "seconds"
  ) => {
    if (e.key === "Enter") {
      applyInput();
    }

    if (e.key === "ArrowRight") {
      if (field === "hours" && minRef.current) {
        minRef.current.focus();
      }
      if (field === "minutes" && secRef.current) {
        secRef.current.focus();
      }
    }

    if (e.key === "ArrowLeft") {
      if (field === "seconds" && minRef.current) {
        minRef.current.focus();
        minRef.current.select();
      }
      if (field === "minutes" && hourRef.current) {
        hourRef.current.focus();
        hourRef.current.select();
      }
    }
  };

  // variables to manage elapsed time
  const prevRemainingTimeRef = useRef(remainingTime);
  const prevTimerKeyRef = useRef(timerKey);

  useEffect(() => {
    // update elapsed time only if timerKey hasn't changed and remainingTime decreased
    if (
      timerKey === prevTimerKeyRef.current &&
      remainingTime < prevRemainingTimeRef.current
    ) {
      setElapsedTime((prev: any) => prev + 1);
    }
    prevRemainingTimeRef.current = remainingTime;
    prevTimerKeyRef.current = timerKey;
  }, [remainingTime, timerKey]);

  return (
    <span
      className="flex flex-row w-1/2 justify-center hover:cursor-pointer font-bold text-2xl"
      onClick={!isEditing ? handleInputEdit : undefined}
      onBlur={handleInputBlur}
    >
      {isEditing ? (
        <>
          <input
            ref={hourRef}
            className="border border-gray-300 rounded w-1/3 text-center"
            value={inputValue.hours}
            onChange={(e) => handleInputChange("hours", e.target.value)}
            onKeyDown={(e) => handleInputKeyDown(e, "hours")}
            onBlur={handleInputBlur}
            onFocus={() => handleInputFocus("hours")}
            placeholder="hh"
            maxLength={2}
          />
          <span>:</span>
          <input
            ref={minRef}
            className="border border-gray-300 rounded w-1/3 text-center"
            value={inputValue.minutes}
            onChange={(e) => handleInputChange("minutes", e.target.value)}
            onKeyDown={(e) => handleInputKeyDown(e, "minutes")}
            onBlur={handleInputBlur}
            onFocus={() => handleInputFocus("minutes")}
            placeholder="mm"
            maxLength={2}
            inputMode="numeric"
          />
          <span>:</span>
          <input
            ref={secRef}
            className="border border-gray-300 rounded w-1/3 text-center"
            value={inputValue.seconds}
            onChange={(e) => handleInputChange("seconds", e.target.value)}
            onKeyDown={(e) => handleInputKeyDown(e, "seconds")}
            onBlur={handleInputBlur}
            onFocus={() => handleInputFocus("seconds")}
            placeholder="ss"
            maxLength={2}
            inputMode="numeric"
          />
        </>
      ) : (
        <>
          {inputValue.hours}:{inputValue.minutes}:{inputValue.seconds}
        </>
      )}
    </span>
  );
}
