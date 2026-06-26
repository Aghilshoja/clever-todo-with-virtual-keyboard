import { getCachedElements } from "./get-cached-element.js";
import { ensureCaret } from "../keyboard-view/keyboard-input-caret.js";
import {
  clearPlaceholder,
  ensurePlaceholder,
} from "../keyboard-view/keyboard-input-behavior.js";
import { disableSubmitIfInputEmpty } from "../keyboard-view/keyboard-input-behavior.js";
import {
  ATTRIBUTES,
  KEYBOARD_STATES,
  LOCAL_STORAGE_KEY,
  PLACEHOLDERS,
} from "../constants/keyboard-constants.js";
import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import { appStateUi } from "../todos-controller.js/todos-controller.js";
import { EDIT_MODES } from "../constants/todo-constants.js";
import { updateTextEditor } from "../keyboard-view/keyboard-caret-positioning.js";
import { handleTaskCharacterLimit } from "./handle-task-character-limit.js";

const elements = getCachedElements();

export const updateEditorState = (key, value) => {
  const savedData =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.TEXT_EDITOR)) || {};
  savedData[key] = value;
  localStorage.setItem(
    LOCAL_STORAGE_KEY.TEXT_EDITOR,
    JSON.stringify(savedData),
  );
};

export const saveInputText = () => {
  const caretState =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.TEXT_EDITOR)) || {};

  if (appStateUi.activeMode === EDIT_MODES.NO_MODES) {
    caretState.caretPosition = virtualKeyboard.caretManeger.caretPosition;
    caretState.draftedNewTask = virtualKeyboard.caretManeger.text;
  }

  localStorage.setItem(
    LOCAL_STORAGE_KEY.TEXT_EDITOR,
    JSON.stringify(caretState),
  );
};

const loadDraft = (input, draft) => {
  clearPlaceholder(input);
  delete input.dataset[KEYBOARD_STATES.INPUT_CARET];
  const caret = ensureCaret(input);
  updateTextEditor(input, caret);
  disableSubmitIfInputEmpty();
  handleTaskCharacterLimit();
  virtualKeyboard.updateAutoCaps();
};

const restoreInputPlaceholder = (input) => {
  input.textContent = "";
  ensurePlaceholder(input);
  virtualKeyboard.resetCaretState();
};

export const loadDraftedInputText = () => {
  const input = elements.inputElement;
  if (!input) return;
  const savedData = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY.TEXT_EDITOR),
  );
  if (!savedData) return;
  const { caretPosition, draftedNewTask, appState } = savedData;

  virtualKeyboard.caretManeger.caretPosition = Number(caretPosition) || 0;

  if (appState) {
    if ((draftedNewTask ?? "").length > 0) {
      virtualKeyboard.caretManeger.text = draftedNewTask;
      virtualKeyboard.caretManeger.caretPosition = caretPosition;
      loadDraft(input, draftedNewTask);
    } else if ((draftedNewTask ?? "").length === 0) {
      restoreInputPlaceholder(input);
    }
    updateEditorState("appState", null);
  } else if (draftedNewTask && draftedNewTask !== PLACEHOLDERS.ENTER_TASK) {
    virtualKeyboard.caretManeger.text = draftedNewTask;
    loadDraft(input, draftedNewTask);
  } else input.dataset[ATTRIBUTES.INPUT_CARET] = "";
};
