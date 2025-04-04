import { createContext, useContext, useState } from "react";

type TimerMode = "stopwatch" | "pomodoro" | "countdown";

interface TimerContextProps {
  timeLeft: number;
  setTimeLeft: (t: number) => void;
  running: boolean;
  setRunning: (r: boolean) => void;
  mode: TimerMode;
  setMode: (m: TimerMode) => void;
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("stopwatch");

  return (
    <TimerContext.Provider
      value={{ timeLeft, setTimeLeft, running, setRunning, mode, setMode }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within TimerProvider");
  }
  return context;
};
