"use client";

import React, { useState } from "react";
import NavButton from "@/components/ui/NavButton";
import { NavPageType } from "@/app/home/page";

export default function Navbar({
  currentPage,
  handleNavigation,
}: {
  currentPage: NavPageType;
  handleNavigation: (page: NavPageType) => void;
}) {
  return (
    <div className="flex mt-2 gap-4">
      {(["tasks", "timer", "spotify", "dashboard"] as NavPageType[]).map(
        (page) => (
          <NavButton
            key={page}
            page={page}
            isActive={currentPage === page}
            onClick={() => handleNavigation(page)}
          />
        )
      )}
    </div>
  );
}
