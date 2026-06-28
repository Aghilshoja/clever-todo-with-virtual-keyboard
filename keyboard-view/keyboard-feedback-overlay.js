import { getCachedElements } from "../shared-components/get-cached-element.js";
import { ATTRIBUTES } from "../constants/keyboard-constants.js";
import { keyboardUiState } from "../keyboard-controler/keyboard-controler.js";

const elements = getCachedElements();

const addPaddingToCornerKeyPreview = (rect) => {
  // Get viewport width
  const viewportWidth = window.innerWidth;

  // Check if key is near the right edge of the viewport
  const isNearRightEdge = rect.right > viewportWidth - 50; // Within 50px of right edge
  const isNearLeftEdge = rect.left < 50; // Within 50px of left edge

  // Reset transform
  elements.previewFeedback.style.transform = "";

  if (isNearRightEdge) {
    elements.previewFeedback.style.transform = "translateX(-0.9rem)";
  } else if (isNearLeftEdge) {
    elements.previewFeedback.style.transform = "translateX(0.9rem)";
  }
};

export const renderKeyPreviewPopup = (keyElement) => {
  if (!keyElement) throw new Error("event hasn't passed correctly");
  if (!elements || !elements.previewFeedback)
    throw new Error("required DOM wasn't found");

  if (keyboardUiState.previewFeedbackTimer) {
    clearTimeout(keyboardUiState.previewFeedbackTimer);
    keyboardUiState.previewFeedbackTimer = null;
  }
  const keysOffsetWidth = keyElement.offsetWidth;
  const rect = keyElement.getBoundingClientRect();

  addPaddingToCornerKeyPreview(rect);

  elements.previewFeedback.textContent = keyElement.textContent;
  elements.previewFeedback.style.bottom = `${rect.bottom}px`;
  elements.previewFeedback.style.top = `${rect.top - 75}px`;
  elements.previewFeedback.style.right = `${rect.right}px`;
  elements.previewFeedback.style.left = `${rect.left - 7}px`;
  elements.previewFeedback.style.opacity = "1";
  elements.previewFeedback.style.width = `${keysOffsetWidth + 17}px`;
};

export const hideKeyPreview = () => {
  if (!elements) throw new Error("required DOM wasn't found");

  if (keyboardUiState.previewFeedbackTimer) {
    clearTimeout(keyboardUiState.previewFeedbackTimer);
    keyboardUiState.previewFeedbackTimer = null;
  }

  keyboardUiState.previewFeedbackTimer = setTimeout(() => {
    elements.previewFeedback.style.opacity = "0";
  }, 300);

  if (keyboardUiState.dragStartTimer)
    clearTimeout(keyboardUiState.dragStartTimer);
  if (keyboardUiState.currentPreviewKey)
    keyboardUiState.currentPreviewKey.draggable = false;
};

export const updatePreviewOnPointerMove = (pointerEvent) => {
  if (!pointerEvent) throw new Error("Key element not provided");
  if (pointerEvent.target.closest(`[${ATTRIBUTES.REGULAR_KEY}]`)) {
    const keyElement = document.elementFromPoint(
      pointerEvent.clientX,
      pointerEvent.clientY,
    );

    if (keyboardUiState.previewFeedbackTimer) {
      clearTimeout(keyboardUiState.previewFeedbackTimer);
      keyboardUiState.previewFeedbackTimer = null;
    }

    const key = keyElement?.closest(`[${ATTRIBUTES.REGULAR_KEY}]`);
    if (key && key !== keyboardUiState.currentPreviewKey) {
      keyboardUiState.currentPreviewKey = key;
      renderKeyPreviewPopup(key);
    }
  }
};
