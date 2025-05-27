"use client";

import React, { useLayoutEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TaskInputProps {
  value: string;
  onChange: (val: string) => void;
}

const TaskInput = ({ value, onChange }: TaskInputProps) => {
  return (
    <input
      value={value}
      onChange={({ target: { value } }) => onChange(value)}
      className="rounded-sm shadow-md border border-gray-200 mb-3 px-2 py-1"
    />
  );
};

export default TaskInput;
