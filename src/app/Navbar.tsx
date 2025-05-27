"use client";

import React from "react";
import NavButton from "@/components/ui/NavButton";

export default function Navbar() {
  return (
    <div className="flex gap-4">
      <NavButton />
      <NavButton />
      <NavButton />
      <NavButton />
    </div>
  );
}
