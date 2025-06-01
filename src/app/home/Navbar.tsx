"use client";

import React, { useState } from "react";
import NavButton from "@/components/ui/NavButton";
import { NavPageType } from "@/app/home/page";
import {
  TaskIcon,
  TimerIcon,
  DashboardIcon,
  SpotifyIcon,
  SettingsIcon,
} from "@/components/ui/Icons";

const icons: Record<NavPageType, React.ReactElement> = {
  tasks: TaskIcon,
  timer: TimerIcon,
  dashboard: DashboardIcon,
  spotify: SpotifyIcon,
  settings: SettingsIcon,
};

export default function Navbar({
  currentPage,
  handleNavigation,
}: {
  currentPage: NavPageType;
  handleNavigation: (page: NavPageType) => void;
}) {
  return (
    <div className="flex justify-center mt-2 gap-4">
      {(["tasks", "timer", "spotify", "dashboard"] as NavPageType[]).map(
        (page) => (
          <NavButton
            key={page}
            page={page}
            isActive={currentPage === page}
            onClick={() => handleNavigation(page)}
            icon={icons[page]}
          />
        )
      )}
    </div>
  );
}
