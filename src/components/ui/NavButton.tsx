"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function NavButton() {
  const [isPressed, setPressed] = useState(false);

  const box = {
    width: 50,
    height: 50,
    backgroundColor: isPressed ? "#9911ff" : "#000000",
    borderRadius: 5,
  };

  const handleButtonPress = () => {
    isPressed ? setPressed(false) : setPressed(true);
  };

  useEffect(() => {
    console.log(isPressed);
  }, [isPressed]);

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
