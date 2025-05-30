"use client";
import React, { createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";

type DbContextType = {
  getTasks: (userId: string) => Promise<any>;
  createTask: (userId: string, data: any) => Promise<any>;
  updateTask: (userId: string, data: any) => Promise<any>;
};

const DbContext = createContext<DbContextType | undefined>(undefined);

export function DbProvider({ children }: { children: React.ReactNode }) {
  const getTasks = async (userId: string) => {
    return supabase.from("tasks").select("*").eq("user_id", userId);
  };

  const createTask = async (userId: string, data: any) => {
    return supabase.from("tasks").insert([{ ...data, user_id: userId }]);
  };

  const updateTask = async (userId: string, data: any) => {
    return supabase.from("tasks").update(data).eq("user_id", userId);
  };

  return (
    <DbContext.Provider value={{ getTasks, createTask, updateTask }}>
      {children}
    </DbContext.Provider>
  );
}

export function useDb() {
  const context = useContext(DbContext);
  if (!context) throw new Error("useDb must be used within a DbProvider");
  return context;
}
