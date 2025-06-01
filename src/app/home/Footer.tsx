"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { NavPageType } from "./page";

export default function Footer({
  handleNavigation,
}: {
  handleNavigation: (page: NavPageType) => void;
}) {
  const { signOut } = useAuth();

  return (
    <div className="m-12">
      <button
        className="hover:underline hover:cursor-pointer"
        onClick={() => handleNavigation("settings")}
      >
        Settings
      </button>{" "}
      |{" "}
      <Link
        className="hover:underline hover:cursor-pointer"
        href="/"
        onClick={signOut}
      >
        Logout
      </Link>
    </div>
  );
}
