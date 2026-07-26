import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";

const patterns = [
  ["day", "month"],
  ["month", "day"],
  ["day", "month", "year"],
  ["month", "day", "year"],
  ["day", "month", "time"],
  ["month", "day", "time"],
  ["day", "month", "year", "time"],
  ["month", "day", "year", "time"],
  ["next", "week"],
  ["next", "week", "time"],
  ["today"],
  ["today", "time"],
  ["tomorrow"],
  ["tomorrow", "time"],
  ["this", "weekend"],
  ["this", "weekend", "time"],
];

const isNumber = (word) => {
  return !isNaN(word) && word.trim() !== "" && !isNaN(parseFloat(word));
};

const isMonth = (word) => {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  return months.includes(word.toLowerCase());
};

const isYear = (word) => {
  return isNumber(word) && word.length === 4;
};

const isTime = (word) => {
  return /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i.test(word);
};

const isTomorrow = (word) => word.toLowerCase() === "tomorrow";

const isToday = (word) => word.toLowerCase() === "today";

const isNext = (word) => word.toLowerCase() === "next";

const isWeek = (word) => word.toLowerCase() === "week";

const isThis = (word) => word.toLowerCase() === "this";

const isWeekEnd = (word) => word.toLowerCase() === "weekend";

const checkers = {
  month: isMonth,
  day: isNumber,
  year: isYear,
  time: isTime,
  today: isToday,
  tomorrow: isTomorrow,
  next: isNext,
  week: isWeek,
  this: isThis,
  weekend: isWeekEnd,
};

const matchesType = (word, requiredType) => {
  const checker = checkers[requiredType];

  if (!checker) {
    return false;
  }

  return checker(word);
};

export const findPatterns = () => {
  const value = virtualKeyboard.caretManeger.text;
  const words = value.split(/\s+/);

  for (let pattern of patterns) {
    if (words.length !== pattern.length) {
      continue;
    }

    let allMatch = true;
    for (let i = 0; i < words.length; i++) {
      if (!matchesType(words[i], pattern[i])) {
        allMatch = false;
        break;
      }
    }

    const result = {};
    if (allMatch) {
      result.hasTime = pattern.includes("time");
      words.forEach((word, index) => {
        result[pattern[index]] = word;
      });
      return result;
    }
  }

  return null;
};
