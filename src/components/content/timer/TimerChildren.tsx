import React, { useState, useEffect, useRef } from "react";

// Helper to format seconds as hh:mm:ss
function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}

// helper to parse hh:mm:ss string into seconds
function parseTimeString(str: string) {
  const parts = str.split(":").map(Number).reverse();
  let seconds = 0;
  if (parts[0]) seconds += parts[0];
  if (parts[1]) seconds += parts[1] * 60;
  if (parts[2]) seconds += parts[2] * 3600;
  return seconds;
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) setInputValue(formatTime(remainingTime));
  }, [remainingTime, isEditing]);

  const handleEditTime = () => {
    setIsEditing(true);
    setIsPlaying(false);
    inputRef?.current?.focus();
  };

  const handleUneditTime = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const applyInput = () => {
    const newDuration = parseTimeString(inputValue);
    if (newDuration > 0) {
      setDuration(newDuration);
      setTimerKey((prev) => prev + 1);
    }
    setIsEditing(false);
  };

  const handleInputBlur = () => {
    applyInput();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyInput();
    }
  };

  return (
    // parse into hh:mm:ss format with enforced 2 digits
    <span
      className="flex flex-col w-1/2 items-center hover:cursor-pointer font-bold text-2xl"
      onClick={!isEditing ? handleEditTime : undefined}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="border border-gray-300 rounded w-full"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />
      ) : (
        formatTime(remainingTime)
      )}
    </span>
  );
}
