"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

type NavPage = "tasks" | "timer" | "spotify" | "dashboard";

export default function NavButton({ page }: { page: string }) {
  const [isPressed, setPressed] = useState(false);
  const [currentPage, setCurrentPage] = useState<NavPage>("tasks");

  const box = {
    width: 50,
    height: 50,
    backgroundColor: isPressed ? "#1C1C84" : "#D3D3D3",
    borderRadius: 5,
  };

  const handleButtonPress = () => {
    isPressed ? setPressed(false) : setPressed(true);
    if (!isPressed) {
      console.log("pressed", page);
      // setCurrentPage(page);
    }
  };

  return (
    <div>
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.96 }}
        style={box}
        onClick={handleButtonPress}
      />
    </div>
  );
}
