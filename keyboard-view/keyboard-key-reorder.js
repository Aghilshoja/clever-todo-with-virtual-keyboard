import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import { uiState } from "../keyboard-controler/keyboard-controler.js";
export const handledraggeingKey = (e) => {
  const draggedKey = e.target.closest(".keyboard__key");
  if (!draggedKey) return;
  draggedKey.classList.add("keyboard__key--dragging");

  const rowIndex = Number(draggedKey.dataset.row);
  const draggedKeyIndex = Number(draggedKey.dataset.col);
  uiState.indexs.rowIndex = rowIndex;
  uiState.indexs.btnIndex = draggedKeyIndex;
};

export const handledragEnter = (e) => {
  e.preventDefault();
  const key = e.target.closest(".keyboard__key");
  if (!key) return;
  key.classList.add("keyboard__key--highlight");
};

export const handledragLeave = (e) => {
  const key = e.target.closest(".keyboard__key");
  if (!key) return;
  if (!key.contains(e.relatedTarget))
    key.classList.remove("keyboard__key--highlight");
};

export const handledragEnd = (e) => {
  const key = e.target.closest(".keyboard__key");
  if (!key) return;
  key.classList.remove("keyboard__key--dragging");

  document
    .querySelectorAll(".keyboard__key--highlight")
    .forEach((k) => k.classList.remove("keyboard__key--highlight"));

  uiState.indexs.rowIndex = null;
  uiState.indexs.btnIndex = null;
  uiState.dragStartTimer = null;
};

export const handleKeyDrop = (e) => {
  const droppedkey = e.target.closest(".keyboard__key");
  if (!droppedkey) return;
  droppedkey.classList.remove("keyboard__key--highlight");
  const droppedKeyIndex = Number(droppedkey.dataset.col);
  const rowIndex = Number(droppedkey.dataset.row);
  const keyboardLayout = virtualKeyboard.activelayout;

  [
    keyboardLayout.rows[rowIndex][droppedKeyIndex],
    keyboardLayout.rows[uiState.indexs.rowIndex][uiState.indexs.btnIndex],
  ] = [
    keyboardLayout.rows[uiState.indexs.rowIndex][uiState.indexs.btnIndex],
    keyboardLayout.rows[rowIndex][droppedKeyIndex],
  ];
  virtualKeyboard.toggleLanguageLayout(keyboardLayout);
};
