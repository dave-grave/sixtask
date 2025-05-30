"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    // send unique code to supabase backend edge function
    if (code) {
      fetch("/api/spotify-exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }).then(() => {
        // redirect when done
        router.replace("/home");
      });
    }
  }, [searchParams, router]);
  return <div>connecting to spotify</div>;
}
