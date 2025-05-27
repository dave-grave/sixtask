"use client";

import React, { useState } from "react";
import NavButton from "@/components/ui/NavButton";

type NavPage = "tasks" | "timer" | "spotify" | "dashboard";

export default function Navbar() {
  const [currentPage, setCurrentPage] = useState<NavPage>("tasks");

  return (
    <div className="flex mt-2 gap-4">
      <NavButton page="tasks" />
      <NavButton page="timer" />
      <NavButton page="spotify" />
      <NavButton page="dashboard" />
    </div>
  );
}
