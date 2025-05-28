"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="m-12">
      Settings | <Link href="/profile">Profile</Link>
    </div>
  );
}
