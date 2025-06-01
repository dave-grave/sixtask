"use client";

import { useState } from "react";
import Home from "./home/page";
import Login from "./Login";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <Login />
    </div>
  );
}
