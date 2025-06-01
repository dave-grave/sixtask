"use client";
import React, { createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

type TaskContextType = {
  getTasks: () => Promise<any>;
  createTask: (data: any) => Promise<any>;
  updateTask: (data: any) => Promise<any>;
  getTaskItems: () => Promise<any>;
  upsertTaskItems: (items: any[]) => Promise<any>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  const getTasks = async () => {
    if (!user) throw new Error("user not found");
    return supabase.from("tasks").select("*").eq("user_id", user.id);
  };

  const createTask = async (data: any) => {
    if (!user) throw new Error("user not found");
    return supabase.from("tasks").insert([{ ...data, user_id: user.id }]);
  };

  const updateTask = async (data: any) => {
    if (!user) throw new Error("user not found");
    return supabase.from("tasks").update(data).eq("user_id", user.id);
  };

  // NEW GET TASK ITEMS
  const getTaskItems = async () => {
    if (!user) throw new Error("user not found to get task items");
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("task_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .order("task_number", { ascending: true });
    if (error) console.error("getTaskItems error:", error);
    return { data, error };
  };

  const upsertTaskItems = async (
    tasks: { value: string; isChecked: boolean }[]
  ) => {
    if (!user) throw new Error("user not found to upsert task items");
    const today = new Date().toISOString().slice(0, 10);
    const items = tasks.map((task, idx) => ({
      date: today,
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

  return (
    <TaskContext.Provider
      value={{
        getTasks,
        createTask,
        updateTask,
        getTaskItems,
        upsertTaskItems,
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
