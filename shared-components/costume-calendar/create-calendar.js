import { ACTIONS, ATTR_STATES } from "../../constants/todo-constants.js";
import { getCachedElements } from "../get-cached-element.js";

const months = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const elements = getCachedElements();

const requiredDates = {
  refMonth: new Date().getMonth(),
  refDay: new Date().getDate(),
  refYear: new Date().getFullYear(),
  refNow: new Date(),

  navMonth: new Date().getMonth(),
  navYear: new Date().getFullYear(),
  navDate: null,
};

const renderCalendar = (day, requiredDates) => {
  const calendar = elements.calendarContainer;
  if (!calendar) return;
  const calendarWeekDay = document.createElement("button");

  const selectedDate = new Date(
    requiredDates.navYear,
    requiredDates.navMonth,
    day,
  );
  selectedDate.setHours(0, 0, 0, 0);

  requiredDates.refNow.setHours(0, 0, 0, 0);

  if (selectedDate < requiredDates.refNow) {
    calendarWeekDay.disabled = true;
  }
  calendarWeekDay.textContent = day;
  calendarWeekDay.dataset.year = requiredDates.navYear;
  calendarWeekDay.dataset.month = requiredDates.navMonth;
  calendarWeekDay.dataset.action = "select-week-day";
  calendarWeekDay.dataset.day = day;

  const isSelectedDay =
    requiredDates.refYear === requiredDates.navYear &&
    requiredDates.refMonth === requiredDates.navMonth &&
    requiredDates.refDay === day;

  if (isSelectedDay)
    calendarWeekDay.dataset[ATTR_STATES.SELECTED_WEEK_DAY] = "";

  calendarWeekDay.classList.add("task-date__week-day");
  calendar.appendChild(calendarWeekDay);
};

const buildWeekDay = (calendar) => {
  daysOfWeek.forEach((day) => {
    const dayName = document.createElement("div");
    dayName.textContent = day;
    dayName.classList.add("day-name");
    calendar.appendChild(dayName);
  });
};

const buildEmptyCells = (calendar) => {
  const firstDayIndex = new Date(
    requiredDates.navYear,
    requiredDates.navMonth,
    1,
  ).getDay();

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty-day");
    calendar.appendChild(emptyCell);
  }
};

const createCalendar = (requiredDates) => {
  const calendar = elements.calendarContainer;
  if (!calendar) return;
  calendar.textContent = "";

  const fullDaysOfMonth = new Date(
    requiredDates.navYear,
    requiredDates.navMonth + 1,
    0,
  ).getDate();

  if (elements.calendarHeader)
    elements.calendarHeader.textContent = `${months[requiredDates.navMonth]} ${requiredDates.navYear}`;

  buildWeekDay(calendar);
  buildEmptyCells(calendar);

  for (let days = 1; days < fullDaysOfMonth + 1; days++) {
    renderCalendar(days, requiredDates);
  }
};

const updateCalendar = (task) => {
  if (task.dueDate === null) {
    const date = new Date();
    requiredDates.refYear = date.getFullYear();
    requiredDates.refMonth = date.getMonth();
    requiredDates.refDay = date.getDate();

    requiredDates.navYear = date.getFullYear();
    requiredDates.navMonth = date.getMonth();
    requiredDates.navDate = date.getDate();
  } else {
    const date = new Date(task.dueDate);
    requiredDates.refYear = date.getFullYear();
    requiredDates.refMonth = date.getMonth();
    requiredDates.refDay = date.getDate();

    requiredDates.navYear = date.getFullYear();
    requiredDates.navMonth = date.getMonth();
    requiredDates.navDate = date.getDate();
  }

  createCalendar(requiredDates);
};

export { months, daysOfWeek, createCalendar, requiredDates, updateCalendar };
