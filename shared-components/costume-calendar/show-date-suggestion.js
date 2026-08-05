import { EDIT_MODES } from "../../constants/todo-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import {
  appStateUi,
  elements,
} from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";
import { requiredDates } from "./create-calendar.js";
import { findPatterns } from "./find-matching-pattern.js";
import {
  renderDayAndMonthSuggestion,
  renderFullDateSuggestion,
  renderNextWeek,
  renderThisWeekend,
  renderToday,
  renderTomorrow,
} from "./format-date-suggestion.js";

const showDateSuggestion = () => {
  if (
    appStateUi.activeMode === EDIT_MODES.DATE_MODE &&
    appStateUi.activeMode === EDIT_MODES.EDIT_TASK_DATE
  )
    return;

  const daysInMonth = new Date(
    requiredDates.navYear,
    requiredDates.navMonth + 1,
    0,
  ).getDate();

  const date = findPatterns();

  renderDateSuggestion(date, daysInMonth);
};

const renderDateSuggestion = (date, daysInMonth) => {
  if (date && "year" in date) {
    renderFullDateSuggestion(date);
    enableSaveDateBtn();
  } else if (
    date &&
    "day" in date &&
    date.day <= daysInMonth &&
    "month" in date
  ) {
    renderDayAndMonthSuggestion(date);
    enableSaveDateBtn();
  } else if (date && "today" in date) {
    renderToday(date);
    enableSaveDateBtn();
  } else if (date && "tomorrow" in date) {
    renderTomorrow(date);
    enableSaveDateBtn();
  } else if (date && "next" in date && "week" in date) {
    renderNextWeek(date);
    enableSaveDateBtn();
  } else if (date && "weekend" in date) {
    renderThisWeekend(date);
    enableSaveDateBtn();
  } else if (date && "day" in date && date.day > daysInMonth) {
    elements.taskDateSuggestion.innerHTML = `<i  class="fa-solid fa-circle-exclamation"></i>
 No result`;
    disableSaveDateBtn();
  } else if (date === null) {
    elements.taskDateSuggestion.innerHTML = `Type a date like <strong>tomorrow 10</strong> or
            <strong>on Monday</strong>`;
    disableSaveDateBtn();
  }
};

const enableSaveDateBtn = () => (elements.saveTaskDate.disabled = false);
const disableSaveDateBtn = () => (elements.saveTaskDate.disabled = true);

export { showDateSuggestion, enableSaveDateBtn, disableSaveDateBtn };
