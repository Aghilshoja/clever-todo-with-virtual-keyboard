import { ensureCaret } from "./keyboard-input-caret.js";
import {
  disableSubmitIfInputEmpty,
  insertText,
} from "./keyboard-input-behavior.js";
import { clearPlaceholder } from "./keyboard-input-behavior.js";
import { disableOrEnableSaveBtn } from "../shared-components/handle-disabling-or-enabling-saving-task-edits.js";
import { handleTaskCharacterLimit } from "../shared-components/handle-task-character-limit.js";
import { saveInputText } from "../shared-components/save-drafted-text-input-to-local-storage.js";
import {
  KEYBOARD_ACTIONS,
  KEYBOARD_STATES,
} from "../constants/keyboard-constants.js";
import { PLACEHOLDERS } from "../constants/keyboard-constants.js";
import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import { elements } from "../todos-controller.js/todos-controller.js";
import { appStateUi } from "../shared-components/todo-states/states.js";
import { MICROPHONE_MODE } from "../constants/todo-constants.js";

export const handleSpaceBar = (e) => {
  if (appStateUi.microphoneMode === MICROPHONE_MODE.MIC_PROMPT) return;
  if (e.target.closest(`[${KEYBOARD_ACTIONS.SPACE}]`)) {
    const input = elements.inputElement;
    // use one source of truth if placeholder of the input changed we just change it in one place
    const isTherePlaceholder =
      input.textContent === PLACEHOLDERS.DESCRIPTION ||
      input.textContent === PLACEHOLDERS.EDIT_TASK ||
      input.textContent === PLACEHOLDERS.ENTER_TASK;

    if (isTherePlaceholder) clearPlaceholder(input);
    const caret = ensureCaret(input);

    insertText(input, " ", caret);
    delete input.dataset[KEYBOARD_STATES.INPUT_CARET];
    saveInputText();
    disableSubmitIfInputEmpty();
    disableOrEnableSaveBtn();
    handleTaskCharacterLimit();
    virtualKeyboard.updateAutoCaps();
  }
};
