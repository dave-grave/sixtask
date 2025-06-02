"use client";
import React, { createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { format } from "date-fns-tz";

type TaskContextType = {
  getTaskItems: () => Promise<any>;
  upsertTaskItems: (items: any[]) => Promise<any>;
  getTaskCompletions: () => Promise<any>;
  upsertTaskCompletions: (val: number) => Promise<any>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const getTaskItems = async () => {
    if (!user) throw new Error("user not found to get task items");
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const todayLocal = format(new Date(), "yyyy-MM-dd", {
      timeZone: userTimeZone,
    });
    const { data, error } = await supabase
      .from("task_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", todayLocal)
      .order("task_number", { ascending: true });
    if (error) console.error("getTaskItems error:", error);
    return { data, error };
  };

  const upsertTaskItems = async (
    tasks: { value: string; isChecked: boolean }[]
  ) => {
    if (!user) throw new Error("user not found to upsert task items");
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const todayLocal = format(new Date(), "yyyy-MM-dd", {
      timeZone: userTimeZone,
    });
    const items = tasks.map((task, idx) => ({
      date: todayLocal,
      task_number: idx + 1,
      value: task.value,
      is_checked: task.isChecked,
      user_id: user.id,
    }));
    const { data, error } = await supabase
      .from("task_items")
      .upsert(items, { onConflict: "user_id,date,task_number" });
    if (error) console.error("upsertTaskItems error:", error);
    return { data, error };
  };

  // get completed tasks from db for bar chart
  const getTaskCompletions = async () => {
    if (!user) throw new Error("user not found to get task completions");
    const { data, error } = await supabase
      .from("task_completions")
      .select("date, completed_count")
      .eq("user_id", user.id)
      .order("date", { ascending: true });
    if (error) console.error("gettaskcompletions error: ", error);
    return data ?? [];
  };

  // update db with number of completed tasks
  const upsertTaskCompletions = async (completedCount: number) => {
    if (!user) throw new Error("user not found to upsert task completions");
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const todayLocal = format(new Date(), "yyyy-MM-dd", {
      timeZone: userTimeZone,
    });
    const { data, error } = await supabase.from("task_completions").upsert(
      [
        {
          user_id: user.id,
          date: todayLocal,
          completed_count: completedCount,
        },
      ],
      { onConflict: "user_id,date" }
    );
    if (error) console.error("upserttaskcompletions error:", error);
    return { data, error };
  };

  return (
    <TaskContext.Provider
      value={{
        getTaskItems,
        upsertTaskItems,
        getTaskCompletions,
        upsertTaskCompletions,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context)
    throw new Error("useTaskContext must be used within a TaskProvider");
  return context;
}
