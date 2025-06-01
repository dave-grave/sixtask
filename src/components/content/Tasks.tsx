"use client";

import React, { useState, useEffect, useRef } from "react";
import TaskInput from "../ui/TaskInput";
import { useTaskContext } from "@/app/context/TaskContext";
import { useAuth } from "@/app/context/AuthContext";

export default function Tasks() {
  const { loading } = useAuth();
  const [tasks, setTasks] = useState(
    Array(6).fill({ value: "", isChecked: false })
  );
  const prevTasks = useRef<string[]>(tasks);
  const { getTaskItems, upsertTaskItems, upsertTaskCompletions } =
    useTaskContext();

  // get userID on mount
  useEffect(() => {
    if (loading) return;

    const fetchData = async () => {
      const { data, error } = await getTaskItems();
      if (data && data.length > 0) {
        setTasks(
          data.map((item: any) => ({
            value: item.value ?? "",
            isChecked: item.is_checked ?? false,
          }))
        );
        prevTasks.current = data.map((item: any) => ({
          value: item.value ?? "",
          isChecked: item.is_checked ?? false,
        }));
      }
    };

    fetchData();
  }, [loading, getTaskItems]);

  // push tasks to supabase every 10s if changes occur
  useEffect(() => {
    const interval = setInterval(async () => {
      if (JSON.stringify(prevTasks.current) !== JSON.stringify(tasks)) {
        await upsertTaskItems(tasks);
        prevTasks.current = tasks;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [tasks, upsertTaskItems]);

  const handleInputChange = (index: number, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], value: value };
    setTasks(updatedTasks);

    upsertTaskItems(updatedTasks);
  };

  const handleCheckChange = (index: number, checked: boolean) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], isChecked: checked };
    setTasks(updatedTasks);
    upsertTaskItems(updatedTasks);
    updateCompletions(updatedTasks);
  };

  const updateCompletions = (updatedTasks: any[]) => {
    const completedCount = updatedTasks.filter((t: any) => t.isChecked).length;
    upsertTaskCompletions(completedCount);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {tasks.map((task, idx) => (
        <TaskInput
          key={idx}
          value={task.value ?? ""}
          onChange={(val) => handleInputChange(idx, val)}
          isChecked={task.isChecked ?? false}
          onCheckChange={(checked) => handleCheckChange(idx, checked)}
        />
      ))}
    </div>
  );
}
