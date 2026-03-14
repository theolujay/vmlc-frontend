export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function formatTimeToStringForCandidate(date: Date | string): string {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatEndTimeToStringForCandidate(
  startTime: Date | string,
  endTime: number,
) {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + endTime * 60000);
  return end.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
