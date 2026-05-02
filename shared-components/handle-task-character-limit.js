import { getCachedElements } from "./get-cached-element.js";
import { getRequiredDom } from "./handle-disabling-or-enabling-saving-task-edits.js";

const elements = getCachedElements();

export const handleTaskCharacterLimit = () => {
  if (!elements) throw new Error("Required DOM was not found");
  const saveBtn = getRequiredDom();
  if (!elements.inputElement) return;
  const input = elements.inputElement;

  const MAX_LIMIT = 500;
  const textLength = input.textContent.length;
  // Prevent unnecessary UI updates if the character count is not exceeding the limit.
  if (textLength < MAX_LIMIT) return;
  if (textLength > MAX_LIMIT) {
    elements.submitTask.disabled = true;
    if (saveBtn.saveButton) saveBtn.saveButton.disabled = true;
    elements.inputCharacterLimit.classList.add("reached-character-limit");
    elements.inputCharacterLimit.textContent = `Task name character limit: ${input.textContent.length} / ${MAX_LIMIT}`;
  } else {
    elements.submitTask.disabled = false;
    if (saveBtn.saveButton) saveBtn.saveButton.disabled = false;
    elements.inputCharacterLimit.classList.remove("reached-character-limit");
    elements.inputCharacterLimit.textContent = "";
  }
};
