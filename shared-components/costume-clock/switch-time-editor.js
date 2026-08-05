import { KEYBOARD_STATES } from "../../constants/keyboard-constants.js";
import { ATTR_STATES, HIDDEN } from "../../constants/todo-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { toggleKeyboard } from "../../keyboard-view/toggle-keyboard.js";
import {
  appStateUi,
  elements,
} from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";

const hideKeyboardUnrelatedOptions = () => {
  elements.unrelatedKeyboardOptions.forEach(
    (fade) => (fade.dataset[ATTR_STATES.UNRELATED_ELS] = HIDDEN.UNRELATED_ELS),
  );
};

const activateNumberKeyboard = () => {
  virtualKeyboard.setLang("keyboardNumber");
  toggleKeyboard();
};

const updateInputElement = () => {
  const caret = ensureCaret(elements.inputElement);
  delete elements.inputElement.dataset[KEYBOARD_STATES.INPUT_CARET];
  updateTextEditor(elements.inputElement, caret);
};

const switchInputToHours = () => {
  appStateUi.currentMinute = Number(virtualKeyboard.caretManeger.text);
  elements.timeMinutesEl.textContent = virtualKeyboard.caretManeger.text;

  activateNumberKeyboard();
  hideKeyboardUnrelatedOptions();

  elements.timeHoursEl.after(elements.inputElement);
  elements.inputElement.textContent = "";
  virtualKeyboard.caretManeger.text = elements.timeHoursEl.textContent;
  virtualKeyboard.caretManeger.caretPosition =
    elements.timeHoursEl.textContent.length;
  updateInputElement();
  elements.timeHoursEl.dataset[ATTR_STATES.HOUR_VISIBILITY] = "";
  delete elements.timeMinutesEl.dataset[ATTR_STATES.MINUTE_VISIBILITY];
};

const switchInputToMinutes = () => {
  appStateUi.currentHour = Number(virtualKeyboard.caretManeger.text);
  elements.timeHoursEl.textContent = virtualKeyboard.caretManeger.text;
  activateNumberKeyboard();
  hideKeyboardUnrelatedOptions();

  elements.timeMinutesEl.after(elements.inputElement);
  elements.inputElement.textContent = "";
  virtualKeyboard.caretManeger.text = elements.timeMinutesEl.textContent;
  virtualKeyboard.caretManeger.caretPosition =
    elements.timeMinutesEl.textContent.length;
  updateInputElement();
  elements.timeMinutesEl.dataset[ATTR_STATES.MINUTE_VISIBILITY] = "";
  delete elements.timeHoursEl.dataset[ATTR_STATES.HOUR_VISIBILITY];
};

export {
  switchInputToHours,
  switchInputToMinutes,
  hideKeyboardUnrelatedOptions,
  activateNumberKeyboard,
  updateInputElement,
};
