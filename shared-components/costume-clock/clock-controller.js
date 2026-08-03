import { PLACEHOLDERS } from "../../constants/keyboard-constants.js";
import {
  ACTIVE,
  ATTR,
  ATTR_STATES,
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
import {
  appStateUi,
  lists,
} from "../../todos-controller.js/todos-controller.js";
import { daysOfWeek, months } from "../costume-calendar/create-calendar.js";
import { showDateSuggestion } from "../costume-calendar/show-date-suggestion.js";
import { getTaskItem } from "../costume-calendar/update-task-due-date-view.js";
import { getCachedElements } from "../get-cached-element.js";
import { initilaizeHours } from "./render-clock.js";
import { editTime, showClock } from "./select-time-manually.js";
import { rotateHourHand, rotateMinuteHand } from "./rotate-clock-hand.js";
import {
  updateHourHandPosition,
  updateMinuteHandPosition,
} from "./clock-view-mode.js";
import {
  exitClockUi,
  putInputElementWhereThatWas,
  updateManualTime,
  updateTimeByClock,
} from "./update-time.js";
import { ensurePlaceholder } from "../../keyboard-view/keyboard-input-behavior.js";
import { restoreDateEditorAfterCancel } from "./exit-clock-mode.js";

const elements = getCachedElements();

const buildClockUI = () => {
  if (!elements.timeContainer || !elements.clockBackdrop) return;

  elements.clockBackdrop.dataset[ATTR_STATES.CLOCK_BACKDROP] = "";

  elements.timeContainer.dataset[ATTR_STATES.TIME_CONTAINER] =
    ACTIVE.TIME_CONTAINER;
  initilaizeHours();
};

const cancelTimeSelection = () => {
  exitClockUi();
  keyboardUiState.activePlaceholder = PLACEHOLDERS.EDIT_TASK_DATE;
  if (elements.circleEl && elements.inputElement) {
    elements.unrelatedKeyboardOptions.forEach(
      (el) => (el.dataset[ATTR_STATES.UNRELATED_ELS] = VISIBLE.UNRELATED_ELS),
    );
    restoreDateEditorAfterCancel();
  }
};

const updateClockDisplay = (event) => {
  rotateHourHand(event.clientX, event.clientY);
  rotateMinuteHand(event.clientX, event.clientY);
};

const decideTimePeriod = (event) => {
  if (event.target.closest(`[${ATTR.TIME_AM}]`)) {
    elements.timePMEl.dataset[ATTR_STATES.SELECTED_TIME_PERIOD] =
      TIME_PERIODS.NOT_SELECTED;

    elements.timeAMEl.dataset[ATTR_STATES.SELECTED_TIME_PERIOD] =
      TIME_PERIODS.AM;
  } else if (event.target.closest(`[${ATTR.TIME_PM}]`)) {
    elements.timeAMEl.dataset[ATTR_STATES.SELECTED_TIME_PERIOD] =
      TIME_PERIODS.NOT_SELECTED;

    elements.timePMEl.dataset[ATTR_STATES.SELECTED_TIME_PERIOD] =
      TIME_PERIODS.PM;
  }
};

const selectTimeByManulType = () => {
  editTime();
};

const restoreClockView = () => {
  if (
    !elements.timeContainer ||
    !elements.timeMinutesEl ||
    !elements.taskDateEditor
  )
    return;

  if (elements.timeContainer) elements.timeContainer.style.top = "50%";
  showClock();

  putInputElementWhereThatWas();

  if (elements.timeHoursEl.hasAttribute("data-hour-visibility")) {
    elements.timeHoursEl.removeAttribute("data-hour-visibility");
    appStateUi.currentHour = Number(virtualKeyboard.caretManeger.text);
    elements.timeHoursEl.textContent = virtualKeyboard.caretManeger.text;
    updateHourHandPosition();
  } else if (elements.timeMinutesEl.hasAttribute("data-minute-visibility")) {
    elements.timeMinutesEl.removeAttribute("data-minute-visibility");
    appStateUi.currentMinute = Number(virtualKeyboard.caretManeger.text);
    elements.timeMinutesEl.textContent = virtualKeyboard.caretManeger.text;
    updateMinuteHandPosition();
  }
  keyboardUiState.activePlaceholder = PLACEHOLDERS.EDIT_TASK_DATE;
};

const saveTime = () => {
  if (keyboardUiState.activePlaceholder === PLACEHOLDERS.EDIT_TIME) {
    updateManualTime();
  } else {
    updateTimeByClock();
  }
  keyboardUiState.activePlaceholder = PLACEHOLDERS.EDIT_TASK_DATE;
};

export {
  buildClockUI,
  cancelTimeSelection,
  updateClockDisplay,
  decideTimePeriod,
  selectTimeByManulType,
  restoreClockView,
  saveTime,
};
