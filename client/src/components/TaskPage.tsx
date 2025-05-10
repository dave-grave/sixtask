import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import TaskElement from "./TaskElement";

export default function TaskPage() {
  const [tasks, setTasks] = useLocalStorage<string[]>("tasks", []);

  // initialize the array when the component mounts
  useEffect(() => {
    if (tasks.length === 0) {
      setTasks(["a", "a", "a", "a", "ab", "a"]);
    }
  }, [tasks, setTasks]);

  // update localStorage list of tasks when we enter input
  const handleInputChange = (index: number, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = value;
    setTasks(updatedTasks);
  };

  const box = {
    width: 100,
    height: 100,
    borderRadius: 5,
    backgroundColor: "#ff1204",
  };

  return (
    <div className="flex flex-col items-center justify-around py-4 min-h-screen">
      <h1 className="text-xl font-bold">sixtask</h1>
      <div className="flex flex-col justify-between items-center gap-4 w-full">
        <TaskElement name="timer" />
        <TaskElement name="spotify" />
      </div>
      {tasks.map((task, index) => (
        <input
          key={index}
          type="text"
          value={task}
          onChange={(e) => handleInputChange(index, e.target.value)}
          className="w-64 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Task ${index + 1}`}
        />
      ))}
    </div>
  );
}
