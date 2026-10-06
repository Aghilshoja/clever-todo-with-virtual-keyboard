import {
  KEYBOARD_STATES,
  LOCAL_STORAGE_KEY,
  PLACEHOLDERS,
} from "../../constants/keyboard-constants.js";
import { ATTR } from "../../constants/todo-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import { ensurePlaceholder } from "../../keyboard-view/keyboard-input-behavior.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { keyboardUiState } from "../../keyboard-view/keyboard-states/states.js";
import { elements } from "../../todos-controller/todos-controller.js";
import { getList } from "../complete-mode.js";

const renderPlaceholder = () => {
  virtualKeyboard.resetCaretState();
  elements.inputElement.textContent = "";
  ensurePlaceholder(elements.inputElement);
};

const restoreDraftedTask = () => {
  const input = elements.inputElement;
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY.TEXT_EDITOR);
  const savedData = raw ? JSON.parse(raw) : null;
  const drafted = savedData?.draftedNewTask ?? "";

  if (drafted.length > 0) {
    const caret = ensureCaret(input);
    virtualKeyboard.caretManeger.text = drafted;
    virtualKeyboard.caretManeger.caretPosition = savedData.caretPosition;
    updateTextEditor(input, caret);
    delete input.dataset[KEYBOARD_STATES.INPUT_CARET];
  } else {
    input.textContent = "";
    ensurePlaceholder(input);
    virtualKeyboard.resetCaretState();
    virtualKeyboard.updateAutoCaps();
  }
};

const fadeKeyboardOptions = (fn) => {
  elements.unrelatedKeyboardOptions.forEach(fn);
};

const disableOrEnableSectionSaveBtn = () => {
  const sectionNameBtn = elements.enterSectionNameBtn;
  const saveBtn = elements.saveSectionBtn;
  const input = elements.inputElement;

  const isSectionNameEmpty =
    keyboardUiState.activePlaceholder === PLACEHOLDERS.SECTION_NAME &&
    input.textContent.trim() === PLACEHOLDERS.SECTION_NAME;

  const isNameEmptyWhileAtAnotherMode =
    sectionNameBtn.textContent === PLACEHOLDERS.SECTION_NAME &&
    keyboardUiState.activePlaceholder === PLACEHOLDERS.SECTION_DESCRIPTION;

  const isInputEmpty = input.textContent.trim() === "";

  if (isSectionNameEmpty) saveBtn.disabled = true;
  else if (isNameEmptyWhileAtAnotherMode) saveBtn.disabled = true;
  else if (isInputEmpty) saveBtn.disabled = true;
  else saveBtn.disabled = false;
};

const hideOrShowTaskEmptyStateBasedOnSections = () => {
  const sectionItem = document.querySelector(`[${ATTR.SECTION_ITEM}]`);
  if (!sectionItem) return;
  const mainList = getList();
  if (!mainList) return;
  const emptyStateEl = mainList.querySelector(`[${ATTR.EMPTY_STATE_TASK}]`);
  if (emptyStateEl) emptyStateEl.remove();
};

export {
  fadeKeyboardOptions,
  restoreDraftedTask,
  renderPlaceholder,
  disableOrEnableSectionSaveBtn,
  hideOrShowTaskEmptyStateBasedOnSections,
};
