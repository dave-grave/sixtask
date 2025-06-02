"use client";
import React, { useContext, createContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { TimerType } from "@/types";
import { format } from "date-fns-tz";

type TimerContextType = {
  getTimer: () => Promise<any>;
  // insertTimer: () => Promise<any>;
  // updateTimer: (data: TimerType) => Promise<void>;
  upsertTimer: (val: Partial<TimerType>) => Promise<any>;
  getAllTimers: () => Promise<any>;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const getTimer = async () => {
    if (!user) throw new Error("No user found");
    const { data } = await supabase
      .from("timer")
      .select()
      .eq("user_id", user.id);
    return data;
  };

  // TODO: move local time into one function
  const upsertTimer = async (timerData: Partial<TimerType>) => {
    if (!user || !user.id) throw new Error("user not found in upsert timer");
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const todayLocal = format(new Date(), "yyyy-MM-dd", {
      timeZone: userTimeZone,
    });
    const { data, error } = await supabase.from("timer").upsert(
      [
        {
          user_id: user.id,
          date: todayLocal,
          ...timerData,
        },
      ],
      { onConflict: "user_id,date" }
    );
    if (error) {
      console.error("Upsert timer error:", error);
      throw error;
    }
    return data;
  };

  const getAllTimers = async () => {
    if (!user) throw new Error("no user found get all timers");
    const { data, error } = await supabase
      .from("timer")
      .select("date, elapsedTime")
      .eq("user_id", user.id)
      .order("date", { ascending: true });
    if (error) {
      console.error("error in getalltimers", error);
      return [];
    }
    return data;
  };

  return (
    <TimerContext.Provider value={{ getTimer, upsertTimer, getAllTimers }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (!context)
    throw new Error("useTimerContext must be used within a TimerProvider");
  return context;
}
