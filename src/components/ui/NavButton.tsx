"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { NavPageType } from "@/app/home/page";

export default function NavButton({
  page,
  isActive,
  onClick,
  icon,
}: {
  page: NavPageType;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  const circle = {
    width: 50,
    height: 50,
    background: isActive
      ? "linear-gradient(145deg, #18186a 60%, #d3d3d3 100%)"
      : "linear-gradient(145deg, #e0e0e0 60%, #ffffff 100%)",
    borderRadius: 20,
    boxShadow: isActive
      ? "inset 2px 2px 8px #1a1a4d, inset -2px -2px 8px #2323a1"
      : "4px 4px 16px #bcbcbc, -4px -4px 16px #ffffff",
    border: "2px solid #d3d3d3",
    cursor: isActive ? "" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "box-shadow 0.05s, background 0.05s",
  };

  return (
    <div>
      <motion.button
        whileHover={isActive ? "" : { scale: 1.08, y: -2 }}
        whileTap={isActive ? "" : { scale: 0.95, y: 2 }}
        style={circle}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          duration: 0.08,
        }}
        onClick={onClick}
      >
        <span style={{ fontWeight: 600, color: isActive ? "#fff" : "#222" }}>
          {icon}
          {/* {page.charAt(0).toUpperCase()} */}
        </span>
      </motion.button>
    </div>
  );
}
