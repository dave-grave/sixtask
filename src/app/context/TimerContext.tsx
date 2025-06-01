"use client";
import React, { useContext, createContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useAuth } from "./AuthContext";
import { TimerType } from "@/types";
import { format } from "date-fns-tz";

type TimerContextType = {
  getTimer: () => Promise<any>;
  // insertTimer: () => Promise<any>;
  // updateTimer: (data: TimerType) => Promise<void>;
  upsertTimer: (val: Partial<TimerType>) => Promise<any>;
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

  // const insertTimer = async () => {
  //   if (!user) throw new Error("No user found");

  // if it's user's first time using clock, create default timer
  //   const { data, error } = await supabase
  //     .from("timer")
  //     .upsert(
  //       [
  //         {
  //           user_id: user.id,
  //           duration: 1500,
  //           initialRemainingTime: 1500,
  //           mode: "study",
  //           numStudy: 0,
  //           numBreak: 0,
  //           isPlaying: false,
  //           isEditing: false,
  //           timerKey: 0,
  //           elapsedTime: 0,
  //         },
  //       ],
  //       { ignoreDuplicates: true }
  //     )
  //     .select();

  //   if (error) {
  //     console.error("Upsert error:", error);
  //     throw error;
  //   }
  //   return data;
  // };

  // const updateTimer = async (data: TimerType) => {
  //   if (!user) throw new Error("No user found");
  //   const { error } = await supabase
  //     .from("timer")
  //     .update(data)
  //     .eq("user_id", user.id);
  //   if (error) {
  //     console.error("Update error:", error);
  //     throw error;
  //   }
  // };

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

  return (
    <TimerContext.Provider value={{ getTimer, upsertTimer }}>
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
