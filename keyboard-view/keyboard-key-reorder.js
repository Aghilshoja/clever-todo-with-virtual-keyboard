import {
  keyboardUiState,
  virtualKeyboard,
} from "../keyboard-controler/keyboard-controler.js";
import {
  ATTRIBUTES,
  KB_CHECK_STATES,
  KEYBOARD_STATES,
} from "../constants/keyboard-constants.js";
export const handledraggeingKey = (e) => {
  const draggedKey = e.target.closest(`[${ATTRIBUTES.REGULAR_KEY}]`);
  if (!draggedKey) return;
  draggedKey.dataset[KEYBOARD_STATES.DRAGGING_KEY] = "";

  const rowIndex = Number(draggedKey.dataset.row);
  const draggedKeyIndex = Number(draggedKey.dataset.col);
  keyboardUiState.indexs.rowIndex = rowIndex;
  keyboardUiState.indexs.btnIndex = draggedKeyIndex;
};

export const handledragEnter = (e) => {
  e.preventDefault();
  const key = e.target.closest(`[${ATTRIBUTES.REGULAR_KEY}]`);
  if (!key) return;
  //  highlight drop target
  key.dataset[KEYBOARD_STATES.DRAGGING_HIGHLIGHT] = "";
};

export const handledragLeave = (e) => {
  const key = e.target.closest(`[${ATTRIBUTES.REGULAR_KEY}]`);
  if (!key) return;
  if (!key.contains(e.relatedTarget))
    delete key.dataset[KEYBOARD_STATES.DRAGGING_HIGHLIGHT];
};

export const handledragEnd = (e) => {
  const key = e.target.closest(`[${ATTRIBUTES.REGULAR_KEY}]`);
  if (!key) return;
  delete key.dataset[KEYBOARD_STATES.DRAGGING_KEY];

  document
    .querySelectorAll(`[${KB_CHECK_STATES.DRAGGING_HIGHLIGHT}]`)
    .forEach((k) => delete k.dataset[KEYBOARD_STATES.DRAGGING_HIGHLIGHT]);

  keyboardUiState.indexs.rowIndex = null;
  keyboardUiState.indexs.btnIndex = null;
  keyboardUiState.dragStartTimer = null;
};

export const handleKeyDrop = (e) => {
  const droppedkey = e.target.closest(`[${ATTRIBUTES.REGULAR_KEY}]`);
  if (!droppedkey) return;
  delete droppedkey.dataset[KEYBOARD_STATES.DRAGGING_HIGHLIGHT];
  const droppedKeyIndex = Number(droppedkey.dataset.col);
  const rowIndex = Number(droppedkey.dataset.row);
  const keyboardLayout = virtualKeyboard.activelayout;

  [
    keyboardLayout.rows[rowIndex][droppedKeyIndex],
    keyboardLayout.rows[keyboardUiState.indexs.rowIndex][
      keyboardUiState.indexs.btnIndex
    ],
  ] = [
    keyboardLayout.rows[keyboardUiState.indexs.rowIndex][
      keyboardUiState.indexs.btnIndex
    ],
    keyboardLayout.rows[rowIndex][droppedKeyIndex],
  ];
  virtualKeyboard.toggleLanguageLayout(keyboardLayout);
};
