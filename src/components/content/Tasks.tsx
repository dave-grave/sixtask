"use client";

import React, { useState, useEffect, useRef } from "react";
import TaskInput from "../ui/TaskInput";
import { supabase } from "@/lib/supabase";

export default function Tasks() {
  const [tasks, setTasks] = useState<string[]>(["", "", "", "", "", ""]);
  const prevTasks = useRef<string[]>(tasks);
  const [userId, setUserId] = useState<string | null>(null);

  // get userID on mount
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        // console.log(data.user.id);
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("tasks")
          .eq("user_id", data.user.id)
          .single();
        if (tasksData?.tasks) {
          setTasks(tasksData.tasks);
          prevTasks.current = tasksData.tasks;
        }
      } else {
        setUserId(null);
      }
    };

    fetchData();
  }, []);

  // push tasks to supabase every 10s if changes occur
  useEffect(() => {
    const interval = setInterval(async () => {
      if (JSON.stringify(prevTasks.current) !== JSON.stringify(tasks)) {
        await supabase.from("tasks").update({ tasks }).eq("user_id", userId);
        prevTasks.current = tasks;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [tasks, userId]);

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
