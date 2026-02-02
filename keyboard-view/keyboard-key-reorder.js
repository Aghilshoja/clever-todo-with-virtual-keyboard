import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import { keyboard } from "./build-keyboard-ui.js";

export const handledraggeingKey = (e) => {
  const draggedKey = e.target.closest(".keys");
  if (!draggedKey) return;

  const rowIndex = Number(draggedKey.dataset.row);
  const draggedKeyIndex = Number(draggedKey.dataset.col);
  virtualKeyboard.indexs.rowIndex = rowIndex;
  virtualKeyboard.indexs.btnIndex = draggedKeyIndex;
};

export const handledragEnter = (e) => {
  e.preventDefault();
  const key = e.target.closest(".keys");
  if (!key) return;
  key.classList.add("keyboard__keys--highlight");
};

export const handledragLeave = (e) => {
  const key = e.target.closest(".keys");
  if (!key) return;
  if (!key.contains(e.relatedTarget))
    key.classList.remove("keyboard__keys--highlight");
};

export const handledragEnd = (e) => {
  const key = e.target.closest(".keys");
  if (!key) return;
  key.classList.remove("keyboard__keys--dragging");

  document
    .querySelectorAll(".keyboard__keys--highlight")
    .forEach((k) => k.classList.remove("keyboard__keys--highlight"));

  virtualKeyboard.indexs.rowIndex = null;
  virtualKeyboard.indexs.btnIndex = null;
  virtualKeyboard.dragStartTimer = null;
};

export const handleKeyDrop = (e) => {
  const droppedkey = e.target.closest(".keys");
  if (!droppedkey) return;
  droppedkey.classList.remove("keyboard__keys--highlight");
  const droppedKeyIndex = Number(droppedkey.dataset.col);
  const rowIndex = Number(droppedkey.dataset.row);
  const keyboardLayout = virtualKeyboard.activelayout;

  [
    keyboardLayout.rows[rowIndex][droppedKeyIndex],
    keyboardLayout.rows[virtualKeyboard.indexs.rowIndex][
      virtualKeyboard.indexs.btnIndex
    ],
  ] = [
    keyboardLayout.rows[virtualKeyboard.indexs.rowIndex][
      virtualKeyboard.indexs.btnIndex
    ],
    keyboardLayout.rows[rowIndex][droppedKeyIndex],
  ];
  virtualKeyboard.toggleLanguageLayout(keyboardLayout);
};
