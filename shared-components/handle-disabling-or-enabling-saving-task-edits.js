import { getCachedElements } from "./get-cached-element.js";
import { appStateUi } from "../todos-controller.js/todos-controller.js";
import { PLACEHOLDERS } from "../constants/keyboard-constants.js";
import { keyboardUiState } from "../keyboard-controler/keyboard-controler.js";
import { ATTR, CHECK_STATES, EDIT_MODES } from "../constants/todo-constants.js";

const elements = getCachedElements();

const checkIfTaskUnchanged = (input) => {
  const taskUnchanged =
    input.textContent === appStateUi.taskObjectToEdit.text ||
    input.textContent === PLACEHOLDERS.EDIT_TASK;
  return taskUnchanged;
};

const checkIfDesChangedTaskUnchanged = (input, taskTextEl, descriptionEl) => {
  const desChangedTaskUnchanged =
    descriptionEl.textContent !== PLACEHOLDERS.DESCRIPTION &&
    descriptionEl.textContent !== appStateUi.taskObjectToEdit.description &&
    taskTextEl.textContent === appStateUi.taskObjectToEdit.text &&
    input.textContent !== PLACEHOLDERS.EDIT_TASK;
  return desChangedTaskUnchanged;
};

const checkIfTaskChanged = (input) => {
  const taskChanged =
    input.textContent !== appStateUi.taskObjectToEdit.text &&
    input.textContent !== PLACEHOLDERS.DESCRIPTION &&
    input.textContent !== appStateUi.taskObjectToEdit.description;
  return taskChanged;
};

const checkIfTaskUnchangedDesUnchanged = (input, taskTextEl) => {
  const taskUnchangedDesUnchanged =
    input.textContent === PLACEHOLDERS.DESCRIPTION &&
    taskTextEl.textContent === appStateUi.taskObjectToEdit.text;
  return taskUnchangedDesUnchanged;
};

const checkIfTaskUnchangedDesChangedOrEmptiedFromItsOriginal = (
  input,
  taskTextEl,
) => {
  let taskUnchangedDesChangedOrEmptiedFromItsOriginal = false;
  if (appStateUi.taskObjectToEdit.description !== null) {
    taskUnchangedDesChangedOrEmptiedFromItsOriginal =
      input.textContent === PLACEHOLDERS.DESCRIPTION &&
      input.textContent !== appStateUi.taskObjectToEdit.description &&
      taskTextEl.textContent === appStateUi.taskObjectToEdit.text;
  }
  return taskUnchangedDesChangedOrEmptiedFromItsOriginal;
};

const checkIftaskUnchangedDesChanged = (input, taskTextEl) => {
  const taskUnchangedDesChanged =
    input.textContent !== PLACEHOLDERS.DESCRIPTION &&
    input.textContent !== appStateUi.taskObjectToEdit.description &&
    taskTextEl.textContent === appStateUi.taskObjectToEdit.text;
  return taskUnchangedDesChanged;
};

const checkIfDescriptionUnchanged = (input, taskTextEl) => {
  const descriptionUnchanged =
    input.textContent === appStateUi.taskObjectToEdit.description &&
    taskTextEl.textContent === appStateUi.taskObjectToEdit.text;
  return descriptionUnchanged;
};

export const getRequiredDom = () => {
  const saveButton = document.querySelector(`[${ATTR.ACTIVE_SAVE_BTN}]`);
  const taskTextEl = document.querySelector(`[${ATTR.TASK_TEXT_ACTIVE}]`);
  const descriptionEl = document.querySelector(`[${ATTR.DESCRIPTION_ACTIVE}]`);
  return {
    saveButton,
    taskTextEl,
    descriptionEl,
  };
};

const checkIfTaskChangedOnPureEditMode = (input) => {
  return (
    input.textContent === PLACEHOLDERS.EDIT_TASK ||
    input.textContent === appStateUi.taskObjectToEdit.text
  );
};

const checkIfTaskDescriptionChangedOnDescriptionMode = (input) => {
  return (
    input.textContent === PLACEHOLDERS.DESCRIPTION ||
    input.textContent === appStateUi.taskObjectToEdit.description
  );
};

export const disableOrEnableSaveBtn = () => {
  const activeEls = getRequiredDom();
  if (
    !activeEls.saveButton ||
    !activeEls.taskTextEl ||
    !activeEls.descriptionEl
  )
    return;
  const input = elements.inputElement;
  const saveBtn = activeEls.saveButton;
  const taskTextEl = activeEls.taskTextEl;
  const descriptionEl = activeEls.descriptionEl;

  if (
    appStateUi.activeMode === EDIT_MODES.EDIT_TASK &&
    appStateUi.taskObjectToEdit
  )
    saveBtn.disabled = checkIfTaskChangedOnPureEditMode(input);

  if (
    appStateUi.activeMode === EDIT_MODES.DESCRIPTION &&
    appStateUi.taskObjectToEdit
  )
    saveBtn.disabled = checkIfTaskDescriptionChangedOnDescriptionMode(input);

  if (
    appStateUi.activeMode === EDIT_MODES.SWITCH_BETWEEN_MODES &&
    appStateUi.taskObjectToEdit
  ) {
    if (
      checkIfTaskUnchanged(input) &&
      keyboardUiState.activePlaceholder === PLACEHOLDERS.EDIT_TASK
    ) {
      if (checkIfDesChangedTaskUnchanged(input, taskTextEl, descriptionEl))
        saveBtn.disabled = false;
      else saveBtn.disabled = true;
    } else if (
      checkIfTaskChanged(input) &&
      keyboardUiState.activePlaceholder === PLACEHOLDERS.EDIT_TASK
    )
      saveBtn.disabled = false;
    else if (
      checkIfTaskUnchangedDesUnchanged(input, taskTextEl) &&
      keyboardUiState.activePlaceholder === PLACEHOLDERS.DESCRIPTION
    ) {
      if (
        checkIfTaskUnchangedDesChangedOrEmptiedFromItsOriginal(
          input,
          taskTextEl,
        )
      )
        saveBtn.disabled = false;
      else saveBtn.disabled = true;
    } else if (
      checkIftaskUnchangedDesChanged(input, taskTextEl) &&
      keyboardUiState.activePlaceholder === PLACEHOLDERS.DESCRIPTION
    )
      saveBtn.disabled = false;
    else if (
      checkIfDescriptionUnchanged(input, taskTextEl) &&
      keyboardUiState.activePlaceholder === PLACEHOLDERS.DESCRIPTION
    )
      saveBtn.disabled = true;
  }
};
