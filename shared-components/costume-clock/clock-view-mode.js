import { PLACEHOLDERS } from "../../constants/keyboard-constants.js";
import {
  ACTIVE,
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  HIDDEN,
  INACTIVE,
  VISIBLE,
} from "../../constants/todo-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { elements } from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";
import { appStateUi } from "../todo-states/states.js";
import { clockInfo } from "./render-clock.js";
import {
  resetMinuteSelection,
  showSpecificMinute,
} from "./rotate-clock-hand.js";
import {
  switchInputToHours,
  switchInputToMinutes,
} from "./switch-time-editor.js";
import { keyboardUiState } from "../../keyboard-view/keyboard-states/states.js";

const updateMinuteHandPosition = () => {
  const clockHand = document.querySelector(`[${ATTR.CLOCK_HAND}]`);
  const minuteAngle =
    appStateUi.currentMinute * (360 / clockInfo.MINUTES_ON_CLOCK);
  clockHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;

  showSpecificMinute(appStateUi.currentMinute);
};

const renderMinutes = () => {
  elements.timeMinutesEl.dataset[ATTR_STATES.TIME_MINUTES] =
    ACTIVE.TIME_MINUTES;

  if (keyboardUiState.activePlaceholder === PLACEHOLDERS.EDIT_TIME) {
    switchInputToMinutes();
  }

  elements.timeHoursEl.dataset[ATTR_STATES.TIME_HOURS] = INACTIVE.TIME_HOURS;

  const hourEls = document.querySelectorAll(`[${CHECK_STATES.CLOCK_HOURS}]`);
  hourEls.forEach((hourEl) => {
    hourEl.dataset[ATTR_STATES.CLOCK_HOURS] = HIDDEN.CLOCK_HOURS;
  });

  const minuteEls = document.querySelectorAll(
    `[${CHECK_STATES.CLOCK_MINUTES}]`,
  );
  minuteEls.forEach((minuteEl) => {
    minuteEl.dataset[ATTR_STATES.CLOCK_MINUTES] = VISIBLE.CLOCK_MINUTES;
  });

  resetMinuteSelection();
  updateMinuteHandPosition();
  virtualKeyboard.setNextHandler(renderHours);
};

const updateHourHandPosition = () => {
  const clockHand = document.querySelector(`[${ATTR.CLOCK_HAND}]`);
  const minuteAngle = appStateUi.currentHour * (360 / clockInfo.HOURS_ON_CLOCK);
  clockHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;

  document.querySelectorAll(`[${CHECK_STATES.TIME_HOUR}]`).forEach((el) => {
    delete el.dataset[ATTR_STATES.SELECTED_HOUR];
    if (parseInt(el.dataset.hour) === appStateUi.currentHour) {
      el.dataset[ATTR_STATES.SELECTED_HOUR] = "";
    }
  });
};

const renderHours = () => {
  elements.timeMinutesEl.dataset[ATTR_STATES.TIME_MINUTES] =
    INACTIVE.TIME_MINUTES;

  if (keyboardUiState.activePlaceholder === PLACEHOLDERS.EDIT_TIME) {
    switchInputToHours();
  }

  elements.timeHoursEl.dataset[ATTR_STATES.TIME_HOURS] = ACTIVE.TIME_HOURS;

  const hourEls = document.querySelectorAll(`[${CHECK_STATES.CLOCK_HOURS}]`);
  hourEls.forEach((hourEl) => {
    hourEl.dataset[ATTR_STATES.CLOCK_HOURS] = VISIBLE.CLOCK_HOURS;
  });

  const minuteEls = document.querySelectorAll(
    `[${CHECK_STATES.CLOCK_MINUTES}]`,
  );
  minuteEls.forEach((minuteEl) => {
    minuteEl.dataset[ATTR_STATES.CLOCK_MINUTES] = HIDDEN.CLOCK_MINUTES;
  });

  resetMinuteSelection();
  updateHourHandPosition();
  virtualKeyboard.setNextHandler(renderMinutes);
};

export {
  renderHours,
  renderMinutes,
  updateHourHandPosition,
  updateMinuteHandPosition,
};
