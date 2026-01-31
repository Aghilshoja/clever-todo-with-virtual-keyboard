import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import { keyboard } from "./build-keyboard-ui.js";

export const handledraggeingKey = (e) => {
  const target = e.target;
  if (!target) return;
  target.classList.add("keyboard__keys--dragging");
  const targetParent = target.parentElement;
  if (!targetParent) return;
  const converRowToArray = Array.from(targetParent.children);
  if (!converRowToArray) return;
  const DraggedKeyIndex = converRowToArray.findIndex(
    (row) => row.id === target.id,
  );

  if (DraggedKeyIndex === -1) return;
  const convertChildrenContainer = Array.from(e.currentTarget.children);
  if (!convertChildrenContainer) return;
  const rowIndex = convertChildrenContainer.findIndex(
    (row) => row.id === targetParent.id,
  );
  if (rowIndex === -1) return;

  virtualKeyboard.indexs.rowIndex = rowIndex;
  virtualKeyboard.indexs.btnIndex = DraggedKeyIndex;
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
  const target = e.target;
  if (!target) return;
  target.classList.remove("keyboard__keys--highlight");
  const targetParent = target.parentElement;
  if (!targetParent) return;
  const convertedDOM = Array.from(e.currentTarget.children);
  if (!convertedDOM) return;
  const indexOfRow = convertedDOM.findIndex(
    (row) => row.id === targetParent.id,
  );
  if (indexOfRow === -1) return;
  const convertDOM = Array.from(targetParent.children);
  if (!convertDOM) return;
  const indexOfKey = convertDOM.findIndex((key) => key.id === e.target.id);
  const languageLayout = keyboard.keyboardStructure.en;
  if (indexOfKey === -1) return;

  [
    languageLayout.rows[indexOfRow][indexOfKey],
    languageLayout.rows[virtualKeyboard.indexs.rowIndex][
      virtualKeyboard.indexs.btnIndex
    ],
  ] = [
    languageLayout.rows[virtualKeyboard.indexs.rowIndex][
      virtualKeyboard.indexs.btnIndex
    ],
    languageLayout.rows[indexOfRow][indexOfKey],
  ];
  virtualKeyboard.toggleLanguageLayout(languageLayout);
};
