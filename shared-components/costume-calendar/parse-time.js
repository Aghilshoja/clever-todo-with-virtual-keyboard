const parseTime = (textInput) => {
  const timePattern = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i;
  const match = textInput.match(timePattern);

  if (!match) return null;

  let hours = parseInt(match[1]);
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const period = match[3] ? match[3].toLowerCase() : null;

  // Convert 12-hour to 24-hour
  if (period === "pm" && hours < 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;

  // Validate
  if (hours > 23 || minutes > 59) return null;

  return { hours, minutes };
};

const formatTimeDisplay = (hours, minutes) => {
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes =
    minutes > 0 ? `:${String(minutes).padStart(2, "0")}` : "";
  return `${displayHours}${displayMinutes} ${period}`;
};

export { parseTime, formatTimeDisplay };
