"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

type NavPage = "tasks" | "timer" | "spotify" | "dashboard";

export default function NavButton({
  page,
  isActive,
  onClick,
}: {
  page: NavPage;
  isActive: boolean;
  onClick: () => void;
}) {
  const [isPressed, setPressed] = useState(false);
  const [currentPage, setCurrentPage] = useState<NavPage>("tasks");

  const circle = {
    width: 50,
    height: 50,
    background: isActive
      ? "linear-gradient(145deg, #18186a 60%, #2323a1 100%)"
      : "linear-gradient(145deg, #e0e0e0 60%, #ffffff 100%)",
    borderRadius: 20,
    boxShadow: isActive
      ? "inset 2px 2px 8px #1a1a4d, inset -2px -2px 8px #2323a1"
      : "4px 4px 16px #bcbcbc, -4px -4px 16px #ffffff",
    border: "2px solid #d3d3d3",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "box-shadow 0.05s, background 0.05s",
  };

  return (
    <div>
      <motion.div
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95, y: 2 }}
        style={circle}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          duration: 0.08,
        }}
      >
        <span style={{ fontWeight: 600, color: isPressed ? "#fff" : "#222" }}>
          {page.charAt(0).toUpperCase()}
        </span>
      </motion.div>
    </div>
  );
}
