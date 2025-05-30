"use client";

import React, { useState, useEffect, useRef } from "react";
import TaskInput from "../ui/TaskInput";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/AuthContext";
import { useDb } from "@/app/context/DbContext";

export default function Tasks() {
  const [tasks, setTasks] = useState<string[]>(["", "", "", "", "", ""]);
  const prevTasks = useRef<string[]>(tasks);
  const { user } = useAuth();
  const { getTasks, updateTask } = useDb();

  // get userID on mount
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data, error } = await getTasks(user.id);
      if (data && data[0]?.tasks) {
        setTasks(data[0].tasks);
        prevTasks.current = data[0].tasks;
      }
    };

    fetchData();
  }, [user, getTasks]);

  // push tasks to supabase every 10s if changes occur
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      if (JSON.stringify(prevTasks.current) !== JSON.stringify(tasks)) {
        await updateTask(user.id, { tasks });
        prevTasks.current = tasks;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [tasks, user, updateTask]);

  const handleInputChange = (index: number, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = value;
    setTasks(updatedTasks);
  };

  return (
    <div className="flex flex-col justify-between ">
      {tasks.map((task, idx) => (
        <TaskInput
          key={idx}
          value={task}
          onChange={(val) => handleInputChange(idx, val)}
        />
      ))}
    </div>
  );
}
