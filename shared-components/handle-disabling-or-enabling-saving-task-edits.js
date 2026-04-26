import { getCachedElements } from "./get-cached-element.js";
import { appStateUi } from "../todos-controller.js/todos-controller.js";

const elements = getCachedElements();

const checkIfTaskUnchanged = (input) => {
  const taskUnchanged =
    input.textContent === appStateUi.taskObjectToEdit.text ||
    input.textContent === "Edit your task";
  return taskUnchanged;
};

const checkIfDesChangedTaskUnchanged = (input, taskTextEl, descriptionEl) => {
  const desChangedTaskUnchanged =
    descriptionEl.textContent !== "Description" &&
    descriptionEl.textContent !== appStateUi.taskObjectToEdit.description &&
    taskTextEl.textContent === appStateUi.taskObjectToEdit.text &&
    input.textContent !== "Edit your task";
  return desChangedTaskUnchanged;
};

const checkIfTaskChanged = (input) => {
  const taskChanged =
    input.textContent !== appStateUi.taskObjectToEdit.text &&
    input.textContent !== "Description" &&
    input.textContent !== appStateUi.taskObjectToEdit.description;
  return taskChanged;
};

const checkIfTaskUnchangedDesUnchanged = (input, taskTextEl) => {
  const taskUnchangedDesUnchanged =
    input.textContent === "Description" &&
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
      input.textContent === "Description" &&
      input.textContent !== appStateUi.taskObjectToEdit.description &&
      taskTextEl.textContent === appStateUi.taskObjectToEdit.text;
  }
  return taskUnchangedDesChangedOrEmptiedFromItsOriginal;
};

const checkIftaskUnchangedDesChanged = (input, taskTextEl) => {
  const taskUnchangedDesChanged =
    input.textContent !== "Description" &&
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

const getRequiredDom = () => {
  const saveButton = document.querySelector(".task__save-edited-task--active");
  const taskTextEl = document.querySelector(".task__toolbar-task-text--active");
  const descriptionEl = document.querySelector(
    ".task__toolbar-description-text--active",
  );
  return {
    saveButton,
    taskTextEl,
    descriptionEl,
  };
};

const checkIfTaskChangedOnPureEditMode = (input) => {
  return (
    input.textContent === "Edit your task" ||
    input.textContent === appStateUi.taskObjectToEdit.text
  );
};

const checkIfTaskDescriptionChangedOnDescriptionMode = (input) => {
  return (
    input.textContent === "Description" ||
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

  if (appStateUi.activeMode === "edit-task" && appStateUi.taskObjectToEdit)
    saveBtn.disabled = checkIfTaskChangedOnPureEditMode(input);

  if (
    appStateUi.activeMode === "edit-description" &&
    appStateUi.taskObjectToEdit
  )
    saveBtn.disabled = checkIfTaskDescriptionChangedOnDescriptionMode(input);

  if (appStateUi.activeMode === "switch" && appStateUi.taskObjectToEdit) {
    if (
      checkIfTaskUnchanged(input) &&
      appStateUi.activePlaceholder === "Edit-your-task"
    ) {
      if (checkIfDesChangedTaskUnchanged(input, taskTextEl, descriptionEl))
        saveBtn.disabled = false;
      else saveBtn.disabled = true;
    } else if (
      checkIfTaskChanged(input) &&
      appStateUi.activePlaceholder === "Edit-your-task"
    )
      saveBtn.disabled = false;
    else if (
      checkIfTaskUnchangedDesUnchanged(input, taskTextEl) &&
      appStateUi.activePlaceholder === "Description"
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
      appStateUi.activePlaceholder === "Description"
    )
      saveBtn.disabled = false;
    else if (
      checkIfDescriptionUnchanged(input, taskTextEl) &&
      appStateUi.activePlaceholder === "Description"
    )
      saveBtn.disabled = true;
  }
};
