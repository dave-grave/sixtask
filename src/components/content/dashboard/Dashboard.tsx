"use client";
import React, { useState, useEffect } from "react";
import { TasksBarChart } from "./TasksBarChart";
import { useTaskContext } from "@/app/context/TaskContext";

export default function Dashboard() {
  const { getTaskCompletions } = useTaskContext();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTaskCompletions();
      setChartData(
        data.map((item: any) => ({
          date: item.date,
          completed: item.completed_count,
        }))
      );
    };
    fetchData();
  }, [getTaskCompletions]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <TasksBarChart chartData={chartData} />
    </div>
  );
}
