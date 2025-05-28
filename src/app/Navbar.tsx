"use client";

import React, { useState } from "react";
import NavButton from "@/components/ui/NavButton";

type NavPage = "tasks" | "timer" | "spotify" | "dashboard";

export default function Navbar() {
  const [currentPage, setCurrentPage] = useState<NavPage>("tasks");

  const handleNavigation = (page: NavPage) => {
    console.log("page");
    setCurrentPage(page);
  };

  return (
    <div className="flex mt-2 gap-4">
      {(["tasks", "timer", "spotify", "dashboard"] as NavPage[]).map((page) => (
        <NavButton
          key={page}
          page={page}
          isActive={currentPage === page}
          onClick={() => handleNavigation(page)}
        />
      ))}
    </div>
  );
}
