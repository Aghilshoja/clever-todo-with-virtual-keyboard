import { getCachedElements } from "../shared-components/get-cached-element.js";
import { ensureCaret } from "./keyboard-input-caret.js";
import { disableSubmitIfInputEmpty } from "./keyboard-input-behavior.js";
import { clearPlaceholder } from "./keyboard-input-behavior.js";
import { disableOrEnableSaveBtn } from "../shared-components/handle-disabling-or-enabling-saving-task-edits.js";
import { handleTaskCharacterLimit } from "../shared-components/handle-task-character-limit.js";
import { saveInputText } from "../shared-components/save-drafted-text-input-to-local-storage.js";
export const handleSpaceBar = (e) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("Required DOM was not found");
  if (e.target.classList.contains("keyboard__spacebar")) {
    const input = elements.inputElement;
    const isTherePlaceholder =
      input.textContent === "Description" ||
      input.textContent === "Edit your task" ||
      input.textContent === "Enter a task";

    if (isTherePlaceholder) clearPlaceholder(input);
    const caret = ensureCaret(input);
    caret.before(document.createTextNode(" "));
    input.classList.remove("keyboard-section__task-input--caret");
    saveInputText();
    disableSubmitIfInputEmpty();
    disableOrEnableSaveBtn();
    handleTaskCharacterLimit();
  }
};
