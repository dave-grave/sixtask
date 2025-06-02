"use client";

import React from "react";

interface TaskInputProps {
  value: string;
  onChange: (val: string) => void;
  isChecked: boolean;
  onCheckChange: (checked: boolean) => void;
}

const TaskInput = ({
  value,
  onChange,
  isChecked,
  onCheckChange,
}: TaskInputProps) => {
  return (
    <div className="flex items-center gap-2 mb-3 border border-rounded">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onCheckChange(e.target.checked)}
        className="accent-primary"
      />
      <input
        value={value}
        onChange={({ target: { value } }) => onChange(value)}
        className="rounded-sm shadow-md border border-gray-200 mb-3 px-2 py-1"
      />
    </div>
  );
};

export default TaskInput;
