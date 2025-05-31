"use client";

import React, { useState, useEffect, useRef } from "react";
import TaskInput from "../ui/TaskInput";
import { useTaskContext } from "@/app/context/TaskContext";
import { useAuth } from "@/app/context/AuthContext";

export default function Tasks() {
  const { loading } = useAuth();
  const [tasks, setTasks] = useState<string[]>(["", "", "", "", "", ""]);
  const prevTasks = useRef<string[]>(tasks);
  const { getTasks, updateTask } = useTaskContext();

  // get userID on mount
  useEffect(() => {
    if (loading) return;

    const fetchData = async () => {
      const { data, error } = await getTasks();
      if (data && data[0]?.tasks) {
        setTasks(data[0].tasks);
        prevTasks.current = data[0].tasks;
      }
    };

    fetchData();
  }, [loading, getTasks]);

  // push tasks to supabase every 10s if changes occur
  useEffect(() => {
    const interval = setInterval(async () => {
      if (JSON.stringify(prevTasks.current) !== JSON.stringify(tasks)) {
        await updateTask({ tasks });
        prevTasks.current = tasks;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [tasks, updateTask]);

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
