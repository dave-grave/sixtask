"use client";
import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error.message);
  }
};

export default function Footer() {
  return (
    <div className="m-12">
      {/* Settings | <Link href="/profile">Profile</Link> */}
      Settings |{" "}
      <Link href="/" onClick={handleLogout}>
        Logout
      </Link>
    </div>
  );
}
