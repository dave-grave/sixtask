"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { signOut } = useAuth();

  return (
    <div className="m-12">
      {/* Settings | <Link href="/profile">Profile</Link> */}
      Settings |{" "}
      <Link href="/" onClick={signOut}>
        Logout
      </Link>
    </div>
  );
}
