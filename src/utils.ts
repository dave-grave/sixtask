export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hours).padStart(2, "0")}:
            ${String(minutes).padStart(2, "0")}:
            ${String(secs).padStart(2, "0")}`;
};

export const createTimer = (
  duration: number,
  onTick: (remaining: number) => void,
  onComplete: () => void
) => {
  let remaining = duration;
  const timerId = setInterval(() => {
    remaining -= 1;
    onTick(remaining);
    if (remaining <= 0) {
      clearInterval(timerId);
      onComplete();
    }
  }, 1000);
  return timerId;
};
