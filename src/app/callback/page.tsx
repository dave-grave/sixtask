"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      console.log(code);
    }
    router.replace("/home");
  }, [searchParams, router]);
  return <div>connecting to spotify</div>;
}
