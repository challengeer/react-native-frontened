import i18n from "@/i18n";

export const getTimeLeft = (timestamp: string): string => {
  const now = new Date().getTime();
  const future = new Date(timestamp).getTime();
  
  const seconds = Math.floor((future - now) / 1000);

  // Less than a minute
  if (seconds < 60) {
    return i18n.t("time.left", { time: `${seconds}s` });
  }

  // Less than an hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return i18n.t("time.left", { time: `${minutes}min` });
  }

  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return i18n.t("time.left", { time: `${hours}h` });
  }

  // Days
  const days = Math.floor(hours / 24);
  return i18n.t("time.left", { time: `${days}d` });
};

export const getTimeAgo = (timestamp: string): string => {
  const now = new Date().getTime();
  const past = new Date(timestamp).getTime();
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d`;
};

