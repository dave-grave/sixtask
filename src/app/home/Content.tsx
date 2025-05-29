"use client";
import React from "react";
import Tasks from "../../components/content/Tasks";
import Timer from "../../components/content/timer/Timer";
import Spotify from "@/components/content/Spotify";
import Dashboard from "@/components/content/Dashboard";
import { NavPageType } from "@/app/home/page";

export default function Content({ currentPage }: { currentPage: NavPageType }) {
  switch (currentPage) {
    case "tasks":
      return <Tasks />;
    case "timer":
      return <Timer />;
    case "spotify":
      return <Spotify />;
    case "dashboard":
      return <Dashboard />;
    default:
      return null;
  }
}
