import { ACTIVE, ATTR_STATES } from "../../constants/todo-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { elements } from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";

const validateHours = () => {
  if (Number(virtualKeyboard.caretManeger.text[0]) <= 1) {
    if (
      Number(virtualKeyboard.caretManeger.text[0]) === 0 &&
      Number(virtualKeyboard.caretManeger.text[1]) < 10
    ) {
      // valid hour and nothing to change
    } else if (Number(virtualKeyboard.caretManeger.text[1]) > 2) {
      virtualKeyboard.caretManeger.text = "12";
      virtualKeyboard.caretManeger.caretPosition = 2;
    }
  } else if (Number(virtualKeyboard.caretManeger.text[0]) > 1) {
    virtualKeyboard.caretManeger.text = "12";
    virtualKeyboard.caretManeger.caretPosition = 2;
  }
};

const validateMinutes = () => {
  if (Number(virtualKeyboard.caretManeger.text[0]) > 5) {
    virtualKeyboard.caretManeger.text = "59";
    virtualKeyboard.caretManeger.caretPosition = 2;
  }
};

const limitTimeInput = () => {
  const caret = ensureCaret(elements.inputElement);

  if (Number(virtualKeyboard.caretManeger.text.length) > 2) {
    virtualKeyboard.caretManeger.text = virtualKeyboard.caretManeger.text.slice(
      0,
      2,
    );
    virtualKeyboard.caretManeger.caretPosition =
      virtualKeyboard.caretManeger.text.length;
  }

  const isHoursGettingEdited =
    elements.timeHoursEl.dataset[ATTR_STATES.TIME_HOURS] === ACTIVE.TIME_HOURS;

  const isMinutesGettingEdited =
    elements.timeMinutesEl.dataset[ATTR_STATES.TIME_MINUTES] ===
    ACTIVE.TIME_MINUTES;

  if (isHoursGettingEdited) validateHours();
  else if (isMinutesGettingEdited) validateMinutes();

  updateTextEditor(elements.inputElement, caret);
};

export { limitTimeInput };
