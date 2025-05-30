// helper type for Timer.tsx
export type TimerType = {
  user_id: string;
  stopwatch: number;
  duration: number;
  remainingTime: number;
  mode: "study" | "break";
  numStudy: number;
  numBreak: number;
  isPlaying: boolean;
  isEditing: boolean;
  timerKey: number;
};
