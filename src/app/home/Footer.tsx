"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { NavPageType } from "./page";

import { SettingsIcon, LogoutIcon } from "@/components/ui/Icons";

export default function Footer({
  handleNavigation,
}: {
  handleNavigation: (page: NavPageType) => void;
}) {
  const { signOut } = useAuth();

  return (
    <div className="m-12 flex items-center gap-4">
      <button
        className="hover:underline hover:cursor-pointer"
        onClick={() => handleNavigation("settings")}
      >
        {SettingsIcon}
      </button>{" "}
      |{" "}
      <Link
        className="hover:underline hover:cursor-pointer"
        href="/"
        onClick={signOut}
      >
        {LogoutIcon}
      </Link>
    </div>
  );
}
