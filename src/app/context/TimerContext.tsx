"use client";
import React, { useContext, createContext } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { TimerType } from "@/types";

type TimerContextType = {
  getTimer: () => Promise<any>;
  insertTimer: () => Promise<any>;
  updateTimer: (data: TimerType) => Promise<void>;
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
            duration: 1500,
            mode: "study",
            numStudy: 0,
            numBreak: 0,
            isPlaying: false,
            isEditing: false,
            timerKey: 0,
            elapsedTime: 0,
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

  const updateTimer = async (data: TimerType) => {
    if (!user) throw new Error("No user found");
    const { error } = await supabase
      .from("timer")
      .update(data)
      .eq("user_id", user.id);
    if (error) {
      console.error("Update error:", error);
      throw error;
    }
  };

  return (
    <TimerContext.Provider value={{ getTimer, insertTimer, updateTimer }}>
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
