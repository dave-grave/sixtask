"use client";
import React, { createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

type TaskContextType = {
  getTasks: () => Promise<any>;
  createTask: (data: any) => Promise<any>;
  updateTask: (data: any) => Promise<any>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

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

  return (
    <TaskContext.Provider value={{ getTasks, createTask, updateTask }}>
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
