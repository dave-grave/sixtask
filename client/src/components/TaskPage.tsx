import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

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

  return (
    <div className="flex flex-col items-center gap-12 py-4">
      <h1 className="text-xl font-bold mb-4">sixtask</h1>
      {tasks.map((task, index) => (
        <input
          key={index}
          type="text"
          value={task}
          onChange={(e) => handleInputChange(index, e.target.value)}
          className="w-64 p-2 border boder-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Task ${index + 1}`}
        />
      ))}
    </div>
  );
}
