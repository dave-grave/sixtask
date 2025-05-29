import React, { useRef } from "react";

type EditableTimeProps = {
  remainingTime: number;
  isEditing: boolean;
  inputValue: string;
  onEdit: () => void;
  onInputChange: (
    field: "hours" | "minutes" | "seconds",
    value: string
  ) => void;
  onInputBlur: () => void;
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

function formatTimeString(time: {
  hours: string;
  minutes: string;
  seconds: string;
}) {
  const hours = String(
    time.hours && !isNaN(Number(time.hours)) ? Number(time.hours) : 0
  ).padStart(2, "0");
  const minutes = String(
    time.minutes && !isNaN(Number(time.minutes)) ? Number(time.minutes) : 0
  ).padStart(2, "0");
  const seconds = String(
    time.seconds && !isNaN(Number(time.seconds)) ? Number(time.seconds) : 0
  ).padStart(2, "0");
  return [hours, minutes, seconds].join(":");
}

function parseTimeString(str: string) {
  const parts = str.split(":").map((p) => p.padStart(2, "0"));
  while (parts.length < 3) parts.unshift("00");
  return {
    hours: parts[0],
    minutes: parts[1],
    seconds: parts[2],
  };
}

export default function EditableTime({
  remainingTime,
  isEditing,
  inputValue,
  onEdit,
  onInputChange,
  onInputBlur,
  onInputKeyDown,
}: EditableTimeProps) {
  const minRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    field: "hours" | "minutes" | "seconds",
    value: string
  ) => {
    console.log(field, value);
    onInputChange(field, value.replace(/\D/, ""));
    if (field === "seconds" && value.length === 2 && minRef.current) {
      minRef.current.focus();
    }
    if (field === "minutes" && value.length === 2 && hourRef.current) {
      hourRef.current.focus();
    }
  };

  const timeObj = parseTimeString(inputValue);

  if (isEditing) {
    return (
      <div className="flex gap-1 items-center">
        <input
          ref={hourRef}
          type="text"
          inputMode="numeric"
          value={timeObj.hours}
          onChange={(e) => handleChange("hours", e.target.value)}
          onBlur={onInputBlur}
          onKeyDown={onInputKeyDown}
          className="text-lg font-bold text-center border rounded w-20"
          placeholder="00"
        />
        <span>:</span>
        <input
          ref={minRef}
          type="text"
          inputMode="numeric"
          value={timeObj.minutes}
          onChange={(e) => handleChange("minutes", e.target.value)}
          onBlur={onInputBlur}
          onKeyDown={onInputKeyDown}
          className="text-lg font-bold text-center border rounded w-20"
          placeholder="00"
        />
        <span>:</span>
        <input
          type="text"
          inputMode="numeric"
          value={timeObj.seconds}
          onChange={(e) => handleChange("seconds", e.target.value)}
          autoFocus
          onBlur={onInputBlur}
          onKeyDown={onInputKeyDown}
          className="text-lg font-bold text-center border rounded w-20"
          placeholder="00"
        />
      </div>
    );
  }
  return (
    <div
      className="flex flex-col cursor-pointer"
      onClick={onEdit}
      title="Click to edit timer"
    >
      <div className="text-lg font-bold">{formatTimeString(timeObj)}</div>
    </div>
  );
}
