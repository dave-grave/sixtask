import React, { useState, useEffect, useRef } from "react";

// helper to format seconds as hh:mm:ss string
function formatTime(totalSeconds: number) {
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
  setTimerKey,
}: {
  remainingTime: number;
  setIsPlaying: (state: boolean) => void;
  duration: number;
  setDuration: (duration: number) => void;
  setTimerKey: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(formatTime(duration));
  const hourRef = useRef<HTMLInputElement>(null);
  const minRef = useRef<HTMLInputElement>(null);
  const secRef = useRef<HTMLInputElement>(null);

  const blurTimeout = useRef<NodeJS.Timeout | null>(null);

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

  const handleInputFocus = () => {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
      blurTimeout.current = null;
    }
  };

  // focus the hour input when in edit mode
  useEffect(() => {
    if (isEditing && hourRef.current) {
      hourRef.current.focus();
    }
  }, [isEditing]);

  // if we leave edit mode or when timer ticks, update inputValue
  useEffect(() => {
    if (!isEditing) setInputValue(formatTime(remainingTime));
  }, [remainingTime, isEditing]);

  const handleInputEdit = () => {
    setIsEditing(true);
    setIsPlaying(false);
    // hourRef?.current?.focus();
  };

  const handleInputChange = (
    field: "hours" | "minutes" | "seconds",
    value: string
  ) => {
    // Only allow numbers, max 2 digits
    if (!/^\d{0,2}$/.test(value)) return;
    setInputValue((prev) => ({ ...prev, [field]: value }));

    if (value.length === 2) {
      if (field === "hours" && minRef.current) minRef.current.focus();
      if (field === "minutes" && secRef.current) secRef.current.focus();
    }
  };

  // update duration when input changes
  const applyInput = () => {
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
        console.log("fopcus minref");
        minRef.current.focus();
      }
      if (field === "minutes" && secRef.current) {
        console.log("fopcus secref");
        secRef.current.focus();
      }
    }

    if (e.key === "ArrowLeft") {
      if (field === "seconds" && minRef.current) minRef.current.focus();
      if (field === "minutes" && hourRef.current) hourRef.current.focus();
    }
  };

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
            onFocus={handleInputFocus}
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
            onFocus={handleInputFocus}
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
            onFocus={handleInputFocus}
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
