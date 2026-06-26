import {
  KEYBOARD_ACTIVE,
  KEYBOARD_INACTIVE,
  KEYBOARD_STATES,
} from "../constants/keyboard-constants.js";
import { ATTR_STATES } from "../constants/todo-constants.js";
import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import { getCachedElements } from "./get-cached-element.js";
import { getRequiredDom } from "./handle-disabling-or-enabling-saving-task-edits.js";

const elements = getCachedElements();

export const handleTaskCharacterLimit = () => {
  if (!elements) throw new Error("Required DOM was not found");
  const saveBtn = getRequiredDom();

  const MAX_LIMIT = 500;
  const currentTextLength = virtualKeyboard.caretManeger.text.length;

  // Prevent unnecessary UI updates if the character count is not exceeding the limit.
  if (currentTextLength < MAX_LIMIT) return;

  if (currentTextLength > MAX_LIMIT) {
    elements.submitTask.disabled = true;
    if (saveBtn.saveButton) saveBtn.saveButton.disabled = true;

    elements.inputCharacterLimit.dataset[
      KEYBOARD_STATES.CHARACTER_LIMIT_COUNTER
    ] = KEYBOARD_ACTIVE.CHARACTER_LIMIT;

    elements.inputCharacterLimit.textContent = `Task name character limit: ${currentTextLength} / ${MAX_LIMIT}`;
  } else {
    elements.submitTask.disabled = false;
    if (saveBtn.saveButton) saveBtn.saveButton.disabled = false;
    elements.inputCharacterLimit.dataset[
      KEYBOARD_STATES.CHARACTER_LIMIT_COUNTER
    ] = KEYBOARD_INACTIVE.CHARACTER_LIMIT;
    elements.inputCharacterLimit.textContent = "";
  }
};
