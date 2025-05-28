"use client";

import React, { useState } from "react";
import TaskInput from "../ui/TaskInput";

export default function Tasks() {
  const [tasks, setTasks] = useState<string[]>(["", "", "", "", "", ""]);

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
