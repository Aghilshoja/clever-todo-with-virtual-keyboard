import { PLACEHOLDERS } from "../../constants/keyboard-constants.js";
import {
  ACTIVE,
  ATTR,
  ATTR_STATES,
  HIDDEN,
  INACTIVE,
  VISIBLE,
} from "../../constants/todo-constants.js";
import {
  keyboardUiState,
  virtualKeyboard,
} from "../../keyboard-controler/keyboard-controler.js";
import {
  appStateUi,
  elements,
} from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";
import { renderMinutes } from "./clock-view-mode.js";
import {
  activateNumberKeyboard,
  hideKeyboardUnrelatedOptions,
  updateInputElement,
} from "./switch-time-editor.js";

const showClock = () => {
  elements.clockFace.dataset[ATTR_STATES.CLOCK_FACE] = VISIBLE.CLOCK_FACE;
  elements.clockBtn.dataset[ATTR_STATES.CLOCK_BTN] = HIDDEN.CLOCK_BTN;
  elements.keyboardBtn.dataset[ATTR_STATES.KEYBOARD_BTN] = VISIBLE.KEYBOARD_BTN;
};

const hideClock = () => {
  elements.clockFace.dataset[ATTR_STATES.CLOCK_FACE] = HIDDEN.CLOCK_FACE;

  elements.keyboardBtn.dataset[ATTR_STATES.KEYBOARD_BTN] = HIDDEN.KEYBOARD_BTN;
  elements.clockBtn.dataset[ATTR_STATES.CLOCK_BTN] = VISIBLE.CLOCK_BTN;
};

const editTime = () => {
  keyboardUiState.activePlaceholder = PLACEHOLDERS.EDIT_TIME;
  hideClock();

  const isMinuteGettingEdited =
    elements.timeMinutesEl.dataset[ATTR_STATES.TIME_MINUTES] ===
    ACTIVE.TIME_MINUTES;

  if (isMinuteGettingEdited) {
    elements.timeMinutesEl.dataset[ATTR_STATES.TIME_MINUTES] =
      INACTIVE.TIME_MINUTES;
  }

  elements.timeContainer.style.top = "30%";

  activateNumberKeyboard();
  hideKeyboardUnrelatedOptions();

  elements.timeHoursEl.after(elements.inputElement);

  elements.inputElement.textContent = "";
  virtualKeyboard.caretManeger.text = elements.timeHoursEl.textContent;

  virtualKeyboard.caretManeger.caretPosition =
    elements.timeHoursEl.textContent.length;

  updateInputElement();

  elements.timeHoursEl.dataset[ATTR_STATES.HOUR_VISIBILITY] = "";
  elements.inputElement.classList.add("number-input");
  virtualKeyboard.setNextHandler(renderMinutes);
};
export { showClock, editTime };
