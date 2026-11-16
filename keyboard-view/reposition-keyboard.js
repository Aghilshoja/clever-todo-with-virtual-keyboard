import { LOCAL_STORAGE_KEY } from "../constants/keyboard-constants.js";
import { elements } from "../todos-controller/todos-controller.js";
import { keyboardUiState } from "./keyboard-states/states.js";

const saveKeyboardPosition = (kbPo) =>
  localStorage.setItem(
    LOCAL_STORAGE_KEY.KEYBOARD_POSITION,
    JSON.stringify(kbPo),
  );

const handleKeyboardDragStart = (e) => {
  if (e.button !== 0) return;

  const keyboardRect = elements.keyboardSection.getBoundingClientRect();

  keyboardUiState.kbDragState.offsetX = e.clientX - keyboardRect.left;
  keyboardUiState.kbDragState.offsetY = e.clientY - keyboardRect.top;

  keyboardUiState.kbDragState.activePointerId = e.pointerId;

  elements.inputElement.setPointerCapture(e.pointerId);

  keyboardUiState.kbDragState.pressTimer = setTimeout(() => {
    keyboardUiState.kbDragState.isDragging = true;
    elements.keyboardSection.classList.add("dragging-keyboard");
  }, keyboardUiState.kbDragState.holdThreshold);
};

const handleKeyboardMove = (e) => {
  if (e.pointerId !== keyboardUiState.kbDragState.activePointerId) return;
  if (!keyboardUiState.kbDragState.isDragging) return;

  e.preventDefault();

  const keyboardRect = elements.keyboardSection.getBoundingClientRect();
  const inputRect = elements.inputElement.getBoundingClientRect();

  const MIN_VISIBLE = keyboardUiState.kbDragState.minVisible;

  const inputOffsetX = inputRect.left - keyboardRect.left;
  const inputOffsetY = inputRect.top - keyboardRect.top;

  const proposedLeft = e.clientX - keyboardUiState.kbDragState.offsetX;
  const proposedTop = e.clientY - keyboardUiState.kbDragState.offsetY;

  // Horizontal boundaries: keep at least MIN_VISIBLE pixels visible.
  const minLeft = MIN_VISIBLE - inputOffsetX - inputRect.width;
  const maxLeft = window.innerWidth - MIN_VISIBLE - inputOffsetX;

  // Vertical boundaries:
  // Keep the input from moving above the viewport,
  // but allow it to move below the viewport partially.

  const minTop = -inputOffsetY;
  const maxTop = window.innerHeight - MIN_VISIBLE - inputOffsetY;

  const left = Math.min(Math.max(proposedLeft, minLeft), maxLeft);
  const top = Math.min(Math.max(proposedTop, minTop), maxTop);

  elements.keyboardSection.style.left = `${left}px`;
  elements.keyboardSection.style.top = `${top}px`;
  elements.keyboardSection.style.bottom = "auto";

  saveKeyboardPosition({ top, left });
};

const handleKeyboardDragEnd = (e) => {
  if (e.pointerId !== keyboardUiState.kbDragState.activePointerId) return;

  clearTimeout(keyboardUiState.kbDragState.pressTimer);
  keyboardUiState.kbDragState.pressTimer = null;

  keyboardUiState.kbDragState.isDragging = false;
  keyboardUiState.kbDragState.activePointerId = null;

  elements.keyboardSection.classList.remove("dragging-keyboard");
};

const loadKeyBoardPosition = () => {
  const { left, top } = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY.KEYBOARD_POSITION),
  );

  if (!left || !top) return;

  elements.keyboardSection.style.left = `${left}px`;
  elements.keyboardSection.style.top = `${top}px`;
  elements.keyboardSection.style.bottom = "auto";
};

export {
  handleKeyboardDragStart,
  handleKeyboardMove,
  handleKeyboardDragEnd,
  loadKeyBoardPosition,
};
