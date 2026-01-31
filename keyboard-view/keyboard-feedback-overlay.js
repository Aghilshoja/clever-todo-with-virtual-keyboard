import { getCachedElements } from "../cached-elements/get-cached-elements.js";
import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";

const elements = getCachedElements();

export const renderKeyPreviewPopup = (keyElement) => {
  if (!keyElement) throw new Error("event hasn't passed correctly");
  if (!elements || !elements.previewFeedback)
    throw new Error("required DOM wasn't found");

  if (virtualKeyboard.previewFeedbackTimer) {
    clearTimeout(virtualKeyboard.previewFeedbackTimer);
    virtualKeyboard.previewFeedbackTimer = null;
  }
  const rect = keyElement.getBoundingClientRect();
  elements.previewFeedback.textContent = keyElement.textContent;
  elements.previewFeedback.style.bottom = `${rect.bottom}px`;
  elements.previewFeedback.style.top = `${rect.top - 55}px`;
  elements.previewFeedback.style.right = `${rect.right}px`;
  elements.previewFeedback.style.left = `${rect.left - 7}px`;
  elements.previewFeedback.style.opacity = "1";
};

export const hideKeyPreview = () => {
  if (!elements) throw new Error("required DOM wasn't found");

  if (virtualKeyboard.previewFeedbackTimer) {
    clearTimeout(virtualKeyboard.previewFeedbackTimer);
    virtualKeyboard.previewFeedbackTimer = null;
  }

  virtualKeyboard.previewFeedbackTimer = setTimeout(() => {
    elements.previewFeedback.style.opacity = "0";
  }, 300);

  if (virtualKeyboard.dragStartTimer && virtualKeyboard.currentPreviewKey) {
    clearTimeout(virtualKeyboard.dragStartTimer);
    virtualKeyboard.currentPreviewKey.draggable = false;
  }
};

export const updatePreviewOnPointerMove = (pointerEvent) => {
  if (!pointerEvent) throw new Error("Key element not provided");
  if (pointerEvent.target.closest(".keys")) {
    const keyElement = document.elementFromPoint(
      pointerEvent.clientX,
      pointerEvent.clientY,
    );

    if (virtualKeyboard.previewFeedbackTimer) {
      clearTimeout(virtualKeyboard.previewFeedbackTimer);
      virtualKeyboard.previewFeedbackTimer = null;
    }

    const key = keyElement?.closest(".keys");
    if (key && key !== virtualKeyboard.currentPreviewKey) {
      virtualKeyboard.currentPreviewKey = key;
      renderKeyPreviewPopup(key);
    }
  }
};
