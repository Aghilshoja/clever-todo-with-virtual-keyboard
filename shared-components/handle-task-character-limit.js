import { getCachedElements } from "./get-cached-element.js";
import { ensureCaret } from "../keyboard-view/keyboard-input-caret.js";
import { getRequiredDom } from "./handle-disabling-or-enabling-saving-task-edits.js";

const elements = getCachedElements();

export const handleTaskCharacterLimit = () => {
  if (!elements) throw new Error("Required DOM was not found");
  const saveBtn = getRequiredDom();
  if (!elements.inputElement) return;
  const input = elements.inputElement;

  const MAX_LIMIT = 500;
  const textLength = input.textContent.length;
  if (textLength > MAX_LIMIT) {
    elements.submitTask.disabled = true;
    if (saveBtn.saveButton) saveBtn.saveButton.disabled = true;
    elements.inputCharacterLimit.classList.add("reached-character-limit");
    elements.inputCharacterLimit.textContent = `Task name character limit: ${input.textContent.length} / 500`;
    const caret = ensureCaret(input);
    const previousNode = caret.previousSibling;
    const highlightExtraChars = document.createElement("span");

    /* prevent adding nested span element if users are deleting characters but hightlight extra characters when they are typing characters */
    if (previousNode.nodeType !== Node.ELEMENT_NODE) {
      highlightExtraChars.appendChild(previousNode);
      highlightExtraChars.classList.add("highlight-extra-chars");
      caret.before(highlightExtraChars);
    }
  } else {
    elements.submitTask.disabled = false;
    if (saveBtn.saveButton) saveBtn.saveButton.disabled = false;
    elements.inputCharacterLimit.classList.remove("reached-character-limit");
    elements.inputCharacterLimit.textContent = "";
  }
};
