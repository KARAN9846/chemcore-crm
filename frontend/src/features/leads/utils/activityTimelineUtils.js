export const formatActivityDateTime = (date, time) => {
  if (!date) {
    return "-";
  }

  const safeDate = String(date);
  const safeTime = time === null || time === undefined ? "" : String(time).slice(0, 5);
  const dateValue = new Date(safeTime ? `${safeDate}T${safeTime}` : safeDate);

  if (Number.isNaN(dateValue.getTime())) {
    return "-";
  }

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dateValue);

  if (!safeTime) {
    return formattedDate;
  }

  const formattedTime = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateValue);

  return `${formattedDate} - ${formattedTime}`;
};

export const getTodayInputDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getCurrentInputTime = () => {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const getRecentActivities = (activities = [], limit = 3) =>
  activities.slice(0, limit);
