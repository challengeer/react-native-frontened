import i18n from "@/i18n";

export const getTimeLeft = (timestamp: string): string => {
  const now = Date.now();
  const future = new Date(timestamp).getTime();
  
  const seconds = Math.floor((future - now) / 1000);

  if (seconds < 0) {
    return getTimeAgo(timestamp);
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
  const now = Date.now();
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
  const now = Date.now();
  const future = new Date(timestamp).getTime();
  const diff = future - now;

  // If time has passed, return "00:00:00"
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

export const getSectionTitle = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const challengeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // Check if it's today
    if (challengeDate.getTime() === today.getTime()) {
        return "Today";
    }
    
    // Check if it's yesterday
    if (challengeDate.getTime() === yesterday.getTime()) {
        return "Yesterday";
    }
    
    // Check if it's within the last 7 days
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    if (challengeDate >= sevenDaysAgo) {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
    
    // For older dates, show the full date
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    
    // If it's from a different year, include the year
    if (date.getFullYear() !== now.getFullYear()) {
        return `${month} ${day}, ${year}`;
    }
    
    return `${month} ${day}`;
};

export const getTimeString = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};