"use client";

import React, { useLayoutEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function TaskInput() {
  const [input, setInput] = useState("");
  const [cursorIndex, setCursorIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.key.length === 1 && !e.ctrlKey) {
      setInput((prev) => prev + e.key);
      setCursorIndex((prev) => prev + 1);
    } else if (e.key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
      setCursorIndex((prev) => Math.max(0, prev - 1));
    }
  };

  useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const target = charRefs.current[cursorIndex - 1];
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (target) {
      const rect = target.getBoundingClientRect();
      console.log(rect);
      console.log(containerRect);
      if (containerRect) {
        setCursorPosition({
          x: rect.right - containerRect.left,
          y: rect.top - containerRect.top,
        });
      }
    } else {
      setCursorPosition({ x: 0, y: 0 });
    }
  }, [input, cursorIndex]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex relative border-b border-gray-400 text-xl 
      font-mono px-1 py-2 focus:outline-none min-h-[2.5rem] w-full"
    >
      <div className="flex items-center flex-wrap">
        {input.split("").map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) charRefs.current[i] = el;
            }}
            className="relative"
          >
            {char}
          </span>
        ))}
      </div>

      <motion.div
        className="absolute w-[2px] h-6 bg-black"
        animate={cursorPosition}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </div>
  );
}
