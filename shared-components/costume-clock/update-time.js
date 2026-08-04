import {
  KEYBOARD_STATES,
  LOCAL_STORAGE_KEY,
  PLACEHOLDERS,
} from "../../constants/keyboard-constants.js";
import {
  ACTIVE,
  ATTR_STATES,
  EDIT_MODES,
  INACTIVE,
  TIME_PERIODS,
  VISIBLE,
} from "../../constants/todo-constants.js";
import {
  keyboardUiState,
  virtualKeyboard,
} from "../../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { appStateUi } from "../../todos-controller.js/todos-controller.js";
import { months } from "../costume-calendar/create-calendar.js";
import {
  getTaskObject,
  quickDateLabels,
} from "../costume-calendar/quick-date-options.js";
import { showDateSuggestion } from "../costume-calendar/show-date-suggestion.js";
import { getCachedElements } from "../get-cached-element.js";
import { exitClockUi } from "./exit-clock-mode.js";

const elements = getCachedElements();

const formatTime = (hour, minute, dueDate) => {
  const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  const year = new Date().getFullYear();

  return `${months[dueDate.getMonth()]} ${dueDate.getDate()} ${dueDate.getFullYear() === year ? "" : dueDate.getFullYear()} ${time}`;
};

const getTimePeriod = () => {
  const isPM =
    elements.timePMEl.dataset[ATTR_STATES.SELECTED_TIME_PERIOD] ===
    TIME_PERIODS.PM;

  if (isPM) {
    if (appStateUi.currentHour !== 12) appStateUi.currentHour += 12;
  } else {
    if (appStateUi.currentHour === 12) appStateUi.currentHour = 0;
  }

  return appStateUi.currentHour;
};

const putInputElementWhereThatWas = () => {
  elements.taskDateEditor.appendChild(elements.inputElement);
  elements.inputElement.classList.remove("number-input");
};

const buildTextEditor = (formattedTime) => {
  virtualKeyboard.caretManeger.text = formattedTime;

  virtualKeyboard.caretManeger.caretPosition = formattedTime.length;

  const caret = ensureCaret(elements.inputElement);

  updateTextEditor(elements.inputElement, caret);
};

const renderTimeToEditor = (date, minute, hour) => {
  date.setHours(hour);
  date.setMinutes(minute);

  const formattedTime = formatTime(hour, minute, date);

  buildTextEditor(formattedTime);
};

const applySelectedTime = () => {
  const date =
    appStateUi.draftedDate === null
      ? new Date()
      : new Date(appStateUi.draftedDate);

  const hour = getTimePeriod();

  renderTimeToEditor(date, appStateUi.currentMinute, hour);
};

const showExistingDatePlusTime = () => {
  applySelectedTime();
};

const assignTodayWithSelectedTime = () => {
  finalizeTimeEditing();
  delete elements.inputElement.dataset[KEYBOARD_STATES.INPUT_CARET];

  applySelectedTime();

  putInputElementWhereThatWas();
  showDateSuggestion();
};

const finalizeTimeEditing = () => {
  if (elements.timeHoursEl.hasAttribute("data-hour-visibility")) {
    elements.timeHoursEl.removeAttribute("data-hour-visibility");
    appStateUi.currentHour = Number(virtualKeyboard.caretManeger.text);
    elements.timeHoursEl.textContent = virtualKeyboard.caretManeger.text;
  } else if (elements.timeMinutesEl.hasAttribute("data-minute-visibility")) {
    appStateUi.currentMinute = Number(virtualKeyboard.caretManeger.text);
    elements.timeMinutesEl.textContent = virtualKeyboard.caretManeger.text;
    elements.timeMinutesEl.removeAttribute("data-minute-visibility");
  }
};

const calculateTime = () => {
  if (appStateUi.draftedDate) {
    finalizeTimeEditing();

    applySelectedTime();
    putInputElementWhereThatWas();

    keyboardUiState.activePlaceholder = PLACEHOLDERS.EDIT_TASK_DATE;
    showDateSuggestion();
  } else assignTodayWithSelectedTime();
};

const commitSelectedTime = () => {
  appStateUi.hasTime = true;

  appStateUi.draftedDate.setHours(
    appStateUi.currentHour,
    appStateUi.currentMinute,
  );

  quickDateLabels.updateLabels();
};

const storeOriginalTime = () => {
  appStateUi.originalHour = appStateUi.currentHour;
  appStateUi.originalMinute = appStateUi.currentMinute;
};

const updateManualTime = () => {
  calculateTime();
  exitClockUi();
  commitSelectedTime();
  storeOriginalTime();
};

const updateTimeByClock = () => {
  const task = getTaskObject();
  if (task.dueDate) showExistingDatePlusTime();
  else assignTodayWithSelectedTime();
  exitClockUi();
  commitSelectedTime();
  storeOriginalTime();
};

export {
  updateManualTime,
  updateTimeByClock,
  exitClockUi,
  putInputElementWhereThatWas,
  renderTimeToEditor,
};
