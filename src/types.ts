// helper type for Timer.tsx
export type TimerType = {
  user_id: string;
  duration: number;
  mode: "study" | "break";
  numStudy: number;
  numBreak: number;
  isPlaying: boolean;
  isEditing: boolean;
  timerKey: number;
  elapsedTime: number;
  initialRemainingTime: number;
};

// spotifyContext.tsx
export type SpotifyContextType = {
  profile: any;
  devices: string[];
  getProfile: () => Promise<void>;
  authUrl: string;
  spotifyToken: string | null;
};
