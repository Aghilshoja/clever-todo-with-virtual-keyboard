import { getCachedElements } from "../shared-components/get-cached-element.js";
import { ensureCaret } from "./keyboard-input-caret.js";
import { disableSubmitIfInputEmpty } from "./keyboard-input-behavior.js";
import { clearPlaceholder } from "./keyboard-input-behavior.js";
import { disableOrEnableSaveBtn } from "../shared-components/handle-disabling-or-enabling-saving-task-edits.js";
import { handleTaskCharacterLimit } from "../shared-components/handle-task-character-limit.js";
import { saveInputText } from "../shared-components/save-drafted-text-input-to-local-storage.js";
import {
  KEYBOARD_ACTIONS,
  KEYBOARD_STATES,
} from "../constants/keyboard-constants.js";
import { PLACEHOLDERS, ATTRIBUTES } from "../constants/keyboard-constants.js";

export const handleSpaceBar = (e) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("Required DOM was not found");
  if (e.target.closest(`[${KEYBOARD_ACTIONS.SPACE}]`)) {
    const input = elements.inputElement;
    if (!input) return;
    // use one source of truth if placeholder of the input changed we just change it in one place
    const isTherePlaceholder =
      input.textContent === PLACEHOLDERS.DESCRIPTION ||
      input.textContent === PLACEHOLDERS.EDIT_TASK ||
      input.textContent === PLACEHOLDERS.ENTER_TASK;

    if (isTherePlaceholder) clearPlaceholder(input);
    const caret = ensureCaret(input);
    caret.before(document.createTextNode(" "));
    delete input.dataset[KEYBOARD_STATES.INPUT_CARET];
    saveInputText();
    disableSubmitIfInputEmpty();
    disableOrEnableSaveBtn();
    handleTaskCharacterLimit();
  }
};
