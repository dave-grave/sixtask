"use client";
import React, { useContext, createContext } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

type TimerContextType = {
  getTimer: () => Promise<any>;
  insertTimer: () => Promise<any>;
  //   updateTimer: (userId: string) => Promise<any>;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const getTimer = async () => {
    if (!user) throw new Error("No user found");

    const { data, error } = await supabase
      .from("timer")
      .select()
      .eq("user_id", user.id);
    return data;
  };

  const insertTimer = async () => {
    if (!user) throw new Error("No user found");

    // if it's user's first time using clock, create default timer
    const { data, error } = await supabase
      .from("timer")
      .upsert(
        [
          {
            user_id: user.id,
            stopwatch: 0,
            duration: 1500,
            remainingTime: 1500,
            mode: "study",
            numStudy: 0,
            numBreak: 0,
            isPlaying: false,
            isEditing: false,
            timerKey: 0,
          },
        ],
        { ignoreDuplicates: true }
      )
      .select();

    if (error) {
      console.error("Upsert error:", error);
      throw error;
    }
    return data;
  };

  return (
    <TimerContext.Provider value={{ getTimer, insertTimer }}>
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
