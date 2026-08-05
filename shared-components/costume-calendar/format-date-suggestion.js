import {
  appStateUi,
  elements,
} from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";
import { daysOfWeek, months, requiredDates } from "./create-calendar.js";
import { formatTimeDisplay, parseTime } from "./parse-time.js";

const getMonthIndex = (month) => {
  return months.findIndex((m) => m.toLowerCase() === month.toLowerCase());
};

const getTimeText = (dateInfo, dueDate) => {
  appStateUi.hasTime = dateInfo.hasTime;
  if (!dateInfo || !("time" in dateInfo)) return "";

  return ` ${formatTimeDisplay(dueDate.getHours(), dueDate.getMinutes())}`;
};

const applyTime = (date, dateInfo) => {
  if (!dateInfo || !("time" in dateInfo)) return date;

  const time = parseTime(dateInfo.time);

  if (!time) return null;

  date.setHours(time.hours, time.minutes, 0, 0);

  return date;
};

const getFullDate = (dateInfo) => {
  const day = Number(dateInfo.day);
  const year = Number(dateInfo.year);

  const monthIndex = getMonthIndex(dateInfo.month);
  if (monthIndex === -1) return;

  const date = new Date(year, monthIndex, day);

  return applyTime(date, dateInfo);
};

const getToday = (dateInfo) => {
  const today = new Date();

  return applyTime(today, dateInfo);
};

const getTomorrow = (dateInfo) => {
  const tomorrow = new Date();
  const TOMORROW = 1;

  tomorrow.setDate(tomorrow.getDate() + TOMORROW);

  return applyTime(tomorrow, dateInfo);
};

const getMonthAndDay = (dateInfo) => {
  const day = Number(dateInfo.day);

  const monthIndex = getMonthIndex(dateInfo.month);
  if (monthIndex === -1) return;

  const currentYear = new Date().getFullYear();

  const date = new Date(currentYear, monthIndex, day);

  return applyTime(date, dateInfo);
};

const getNextWeek = (dateInfo) => {
  return applyTime(today, dateInfo);
};

const getThisWeekEnd = (dateInfo) => {
  const today = new Date();
  const todayIndex = today.getDay();

  const SATURDAY_INDEX = 6;

  let daysUntilMonday = SATURDAY_INDEX - todayIndex;

  if (daysUntilMonday < 0) {
    daysUntilMonday += 7;
  }

  today.setDate(today.getDate() + daysUntilMonday);

  return applyTime(today, dateInfo);
};

const renderThisWeekend = (dateInfo) => {
  const dueDate = getThisWeekEnd(dateInfo);
  if (!dueDate) return;

  appStateUi.draftedDate = dueDate;
  const time = getTimeText(dateInfo, dueDate);

  elements.taskDateSuggestion.innerHTML = `
        <i class='far fa-calendar-alt'></i> ${daysOfWeek[dueDate.getDay()]}, ${months[dueDate.getMonth()]} ${dueDate.getDate()} ${time}
      `;
};

const renderNextWeek = (dateInfo) => {
  const dueDate = getNextWeek(dateInfo);
  if (!dueDate) return;

  appStateUi.draftedDate = dueDate;
  const time = getTimeText(dateInfo, dueDate);

  elements.taskDateSuggestion.innerHTML = `
        <i class='far fa-calendar-alt'></i> ${daysOfWeek[dueDate.getDay()]}, ${months[dueDate.getMonth()]} ${dueDate.getDate()} ${time}
      `;
};

const renderDayAndMonthSuggestion = (dateInfo) => {
  const dueDate = getMonthAndDay(dateInfo);
  if (!dueDate) return;

  appStateUi.draftedDate = dueDate;

  const time = getTimeText(dateInfo, dueDate);

  elements.taskDateSuggestion.innerHTML = `
    <i class="far fa-calendar-alt"></i>
    ${daysOfWeek[dueDate.getDay()]}, ${months[dueDate.getMonth()]} ${dueDate.getDate()} ${time} 
  `;
};

const renderTomorrow = (dateInfo) => {
  const dueDate = getTomorrow(dateInfo);
  if (!dueDate) return;

  appStateUi.draftedDate = dueDate;

  const time = getTimeText(dateInfo, dueDate);

  elements.taskDateSuggestion.innerHTML = `
    <i class="far fa-calendar-alt"></i>
    ${daysOfWeek[dueDate.getDay()]}, ${months[dueDate.getMonth()]} ${dueDate.getDate()} ${time} 
  `;
};

const renderToday = (dateInfo) => {
  const dueDate = getToday(dateInfo);
  if (!dueDate) return;

  appStateUi.draftedDate = dueDate;

  const time = getTimeText(dateInfo, dueDate);

  elements.taskDateSuggestion.innerHTML = `
    <i class="far fa-calendar-alt"></i>
    ${daysOfWeek[dueDate.getDay()]}, ${months[dueDate.getMonth()]} ${dueDate.getDate()} ${time} 
  `;
};

const renderFullDateSuggestion = (dateInfo) => {
  const dueDate = getFullDate(dateInfo);
  if (!dueDate) return;

  appStateUi.draftedDate = dueDate;

  const time = getTimeText(dateInfo, dueDate);

  elements.taskDateSuggestion.innerHTML = `
    <i class="far fa-calendar-alt"></i>
    ${daysOfWeek[dueDate.getDay()]}, ${months[dueDate.getMonth()]} ${dueDate.getDate()} ${dueDate.getFullYear()} ${time} 
  `;
};

export {
  renderFullDateSuggestion,
  renderToday,
  renderTomorrow,
  renderThisWeekend,
  renderNextWeek,
  renderDayAndMonthSuggestion,
};
