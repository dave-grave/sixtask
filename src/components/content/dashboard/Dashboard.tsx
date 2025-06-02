"use client";
import React, { useState, useEffect } from "react";
import { TasksBarChart } from "./TasksBarChart";
import { useTaskContext } from "@/app/context/TaskContext";
import { useTimerContext } from "@/app/context/TimerContext";
import { TimerBarChart } from "./TimerBarChart";

export default function Dashboard() {
  const { getTaskCompletions } = useTaskContext();
  const { getAllTimers } = useTimerContext();
  const [taskData, setTaskData] = useState([]);
  const [timerData, setTimerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTaskCompletions();
      setTaskData(
        data.map((item: any) => ({
          date: item.date,
          completed: item.completed_count,
        }))
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTimerData = async () => {
      const data = await getAllTimers();

      setTimerData(
        data.map((item: any) => ({
          date: item.date,
          elapsedTime: item.elapsedTime,
        }))
      );
    };
    fetchTimerData();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
      <TasksBarChart chartData={taskData} />
      <TimerBarChart chartData={timerData} />
    </div>
  );
}
