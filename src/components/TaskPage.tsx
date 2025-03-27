import React, { useState, useEffect } from "react";

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  useEffect(() => {
    const savedTasks: string[] = JSON.parse(
      localStorage.getItem("tasks") || "[]"
    );
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (): void => {
    if (newTask.trim() && tasks.length < 6) {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const removeTask = (index: number): void => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Task List</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-1 p-2 text-black rounded-1"
          placeholder="Add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          className="bg-blue-500 px-4 py-2 rounded-r hover:bg-blue-700"
          onClick={addTask}
          disabled={tasks.length >= 6}
        >
          Add
        </button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-800 p-2 rounded mb-2"
          >
            <span>{task}</span>
            <button
              className="text-red-500 hover:text-red-700  "
              onClick={() => removeTask(index)}
            >
              X
            </button>
          </li>
        ))}
      </ul>
      {tasks.length >= 6 && (
        <p className="text-sm text-yellow-400 mt-2">Max 6 tasks allowed</p>
      )}
    </div>
  );
};

export default TaskPage;
