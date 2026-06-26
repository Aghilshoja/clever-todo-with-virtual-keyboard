import { ensureCaret } from "./keyboard-input-caret.js";
import { getCachedElements } from "../shared-components/get-cached-element.js";
import { PLACEHOLDERS } from "../constants/keyboard-constants.js";
import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import { appStateUi } from "../todos-controller.js/todos-controller.js";
import { EDIT_MODES } from "../constants/todo-constants.js";
import { updateEditorState } from "../shared-components/save-drafted-text-input-to-local-storage.js";

export const updateTextEditor = (input, caret) => {
  const caretState = virtualKeyboard.caretManeger;

  const textBeforeCaret = document.createTextNode(
    caretState.text.slice(0, caretState.caretPosition),
  );

  const textAfterCaret = document.createTextNode(
    caretState.text.slice(caretState.caretPosition),
  );

  input.replaceChildren(textBeforeCaret, caret, textAfterCaret);
};

export const positionCaret = (e) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");

  const input = elements.inputElement;
  const isTherePlaceholder =
    input.textContent === PLACEHOLDERS.DESCRIPTION ||
    input.textContent === PLACEHOLDERS.EDIT_TASK ||
    input.textContent === PLACEHOLDERS.ENTER_TASK;

  if (isTherePlaceholder) return;
  const caret = ensureCaret(input);

  const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
  if (!pos) return;

  const { offsetNode, offset } = pos;

  if (offsetNode.nodeType !== Node.TEXT_NODE) return;

  let position = offset;

  let node = offsetNode.previousSibling;

  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      position += node.textContent.length;
    }

    node = node.previousSibling;
  }

  virtualKeyboard.caretManeger.caretPosition = position;

  updateTextEditor(input, caret);

  const isEditModeActive = appStateUi.activeMode === EDIT_MODES.NO_MODES;

  // Only persist caret positions for new-task drafts, not task edits.
  if (isEditModeActive) {
    updateEditorState(
      "caretPosition",
      virtualKeyboard.caretManeger.caretPosition,
    );
  }
};
