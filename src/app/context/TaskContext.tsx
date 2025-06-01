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
    return supabase
      .from("task_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .order("task_number", { ascending: true });
  };

  const upsertTaskItems = async (items: any[]) => {
    if (!user) throw new Error("user not found to upsert task items");
    return supabase
      .from("task_items") // <-- use your actual table name
      .upsert(
        items.map((item) => ({
          ...item,
          user_id: user.id,
        })),
        { onConflict: "user_id,date,task_number" }
      );
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
