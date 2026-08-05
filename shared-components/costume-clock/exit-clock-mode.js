import {
  ACTIVE,
  ATTR_STATES,
  INACTIVE,
} from "../../constants/todo-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import { ensurePlaceholder } from "../../keyboard-view/keyboard-input-behavior.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import {
  appStateUi,
  elements,
} from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";
import { showClock } from "./select-time-manually.js";
import {
  putInputElementWhereThatWas,
  renderTimeToEditor,
} from "./update-time.js";

const restoreOriginalTime = () => {
  const date =
    appStateUi.draftedDate === null
      ? new Date()
      : new Date(appStateUi.draftedDate);

  renderTimeToEditor(date, appStateUi.originalMinute, appStateUi.originalHour);
};

const restoreDateEditorAfterCancel = () => {
  if (appStateUi.hasTime) restoreOriginalTime();
  else {
    elements.inputElement.textContent = "";
    ensurePlaceholder(elements.inputElement);
  }
};

const resetClockStates = () => {
  if (elements.timeHoursEl.hasAttribute("data-hour-visibility")) {
    elements.timeHoursEl.removeAttribute("data-hour-visibility");
  } else if (elements.timeMinutesEl.hasAttribute("data-minute-visibility")) {
    elements.timeMinutesEl.removeAttribute("data-minute-visibility");
  }
};

const exitClockUi = () => {
  elements.timeContainer.dataset[ATTR_STATES.TIME_CONTAINER] =
    INACTIVE.TIME_CONTAINER;

  const isMinuteSelected =
    elements.timeMinutesEl.dataset[ATTR_STATES.TIME_MINUTES] ===
    ACTIVE.TIME_MINUTES;

  if (isMinuteSelected) {
    elements.timeMinutesEl.dataset[ATTR_STATES.TIME_MINUTES] =
      INACTIVE.TIME_MINUTES;
  }

  resetClockStates();

  virtualKeyboard.setLang("en");

  elements.timeContainer.style.top = "50%";

  delete elements.clockBackdrop.dataset[ATTR_STATES.CLOCK_BACKDROP];

  showClock();
  putInputElementWhereThatWas();
  virtualKeyboard.clearNextHandler();
};

export { exitClockUi, restoreDateEditorAfterCancel };
