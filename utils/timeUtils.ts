import i18n from "@/i18n";

export const getCurrentUTCTime = (): number => {
  const now = new Date();
  return new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    now.getUTCMilliseconds()
  ).getTime();
};

export const getTimeLeft = (timestamp: string): string => {
  const now = getCurrentUTCTime();
  const future = new Date(timestamp).getTime();
  const seconds = Math.floor((future - now) / 1000);

  if (seconds < 0) {
    return i18n.t("time.ended");
  }

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
  const now = getCurrentUTCTime();
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

export const getDetailedTimeLeft = (timestamp: string): string => {
  const now = getCurrentUTCTime();
  const future = new Date(timestamp).getTime();
  const diff = future - now;

  if (diff < 0) {
    return i18n.t("time.ended");
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor(diff / (1000 * 60 * 60));

  // Pad with zeros to maintain consistent format
  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

export const getSectionTitle = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date(getCurrentUTCTime());
    
    // Create date objects without time components
    const today = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const challengeDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    
    // Check if it's today
    if (challengeDate.getTime() === today.getTime()) {
        return i18n.t('time.today');
    }
    
    // Check if it's yesterday
    if (challengeDate.getTime() === yesterday.getTime()) {
        return i18n.t('time.yesterday');
    }
    
    // Check if it's within the last 7 days
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    if (challengeDate >= sevenDaysAgo) {
        return date.toLocaleDateString(i18n.locale, { weekday: 'long' });
    }
    
    // For older dates, show the full date
    const month = date.toLocaleDateString(i18n.locale, { month: 'short' });
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    
    // If it's from a different year, include the year
    if (date.getUTCFullYear() !== now.getUTCFullYear()) {
        return i18n.t('time.fullDate', { month, day, year });
    }
    
    return i18n.t('time.shortDate', { month, day });
};

export const getTimeString = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};