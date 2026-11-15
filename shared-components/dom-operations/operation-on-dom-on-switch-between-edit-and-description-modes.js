import { elements } from "../../todos-controller/todos-controller.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { cleanupDescriptionAndEditUi } from "./shared-cleaningup-edit-and-description-mode-ui.js";
import { disableOrEnableSaveBtn } from "../handle-disabling-or-enabling-saving-task-edits.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import {
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  EDIT_MODES,
  HIDDEN,
} from "../../constants/todo-constants.js";
import {
  PLACEHOLDERS,
  KEYBOARD_STATES,
} from "../../constants/keyboard-constants.js";
import { getRepetitiveElements } from "./shared-entering-edit-or-description-modes-ui.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import { appStateUi } from "../todo-states/states.js";
import { keyboardUiState } from "../../keyboard-view/keyboard-states/states.js";
import { updateEditedTask } from "./operation-on-dom-on-edit-modes.js";

const editDescription = (descriptionEl, toolbar) => {
  if (!descriptionEl) return;
  const taskText = toolbar.querySelector(`[${ATTR.TASK_TEXT}]`);
  if (!taskText) return;
  const input = elements.inputElement;

  delete taskText.dataset[ATTR_STATES.TASK_TEXT_STATE];
  if (virtualKeyboard.caretManeger.text !== "") {
    taskText.textContent = input.textContent;
  }

  // Clear visual caret before description edit (prevents double caret bug)
  delete input.dataset[KEYBOARD_STATES.INPUT_CARET];
  descriptionEl.dataset[ATTR_STATES.DESCRIPTION_STATE] =
    HIDDEN.TASK_DESCRIPTION;
  descriptionEl.after(input);
  if (descriptionEl.textContent === PLACEHOLDERS.DESCRIPTION) {
    input.textContent = PLACEHOLDERS.DESCRIPTION;
    input.dataset[KEYBOARD_STATES.INPUT_CARET] = "";
    virtualKeyboard.resetCaretState();
  } else {
    const caret = ensureCaret(input);
    virtualKeyboard.caretManeger.text = descriptionEl.textContent;
    virtualKeyboard.caretManeger.caretPosition =
      descriptionEl.textContent.length;

    updateTextEditor(input, caret);
  }
  disableOrEnableSaveBtn();
};

const editTask = (taskEl, toolbar) => {
  if (!taskEl) return;
  const description = toolbar.querySelector(`[${ATTR.TASK_DESCRIPTION}]`);
  if (!description) return;
  const input = elements.inputElement;

  delete description.dataset[ATTR_STATES.DESCRIPTION_STATE];
  if (input.textContent === PLACEHOLDERS.DESCRIPTION) {
    description.textContent = PLACEHOLDERS.DESCRIPTION;
  } else {
    description.textContent = virtualKeyboard.caretManeger.text;
  }
  taskEl.after(input);
  taskEl.dataset[ATTR_STATES.TASK_TEXT_STATE] = HIDDEN.TASK_TEXT;
  delete input.dataset[KEYBOARD_STATES.INPUT_CARET];
  const caret = ensureCaret(input);

  virtualKeyboard.caretManeger.text = taskEl.textContent;
  virtualKeyboard.caretManeger.caretPosition = taskEl.textContent.length;

  updateTextEditor(input, caret);
};

/**
 * Cancel switch mode: restore toolbar text from main task item
 * (main task item never changed during edit)
 */
export const revertTextOfDescriptionAndTaskText = (event) => {
  const toolbar = event.target.closest(`[${ATTR.TASK_TOOLBAR}]`);
  if (!toolbar) return;
  const repetitiveEls = getRepetitiveElements(toolbar);
  const taskItemDescription = repetitiveEls.taskItemDescription;
  const toolbarDescription = repetitiveEls.description;

  const taskText = repetitiveEls.taskItemText; // visible task text not in the toolbar
  const toolbarTaskText = repetitiveEls.taskTextEl;

  if (taskItemDescription && toolbarDescription) {
    toolbarDescription.textContent = taskItemDescription.textContent;
  }

  if (taskText && toolbarTaskText) {
    toolbarTaskText.textContent = taskText.textContent;
  }
};

export const editDescriptionAndTask = (event) => {
  const isToolbarActive = event.target.closest(
    `[${CHECK_STATES.TOOLBAR_FULL_HEIGHT}]`,
  );
  if (!isToolbarActive) return;

  const isTaskClicked = event.target.closest(`[${ATTR.TASK_TEXT}]`);

  const isDescriptionClicked = event.target.closest(
    `[${ATTR.TASK_DESCRIPTION}]`,
  );

  if (!isDescriptionClicked && !isTaskClicked) return;

  const mixTarget = isDescriptionClicked || isTaskClicked;
  appStateUi.lastClickedElement.lastEl = mixTarget;

  appStateUi.activeMode = EDIT_MODES.SWITCH_BETWEEN_MODES;

  if (isDescriptionClicked) {
    editDescription(isDescriptionClicked, isToolbarActive);
    keyboardUiState.activePlaceholder = PLACEHOLDERS.DESCRIPTION;
  } else if (isTaskClicked) {
    editTask(isTaskClicked, isToolbarActive);
    keyboardUiState.activePlaceholder = PLACEHOLDERS.EDIT_TASK;
  }
};

const getElements = (toolbar) => {
  const {
    description,
    taskItemDescription,
    taskItemText,
    clonedTaskInToolbar,
    taskTextEl,
  } = getRepetitiveElements(toolbar);

  if (!description || !taskItemDescription || !taskItemText || !taskTextEl)
    return;

  const isTextTask = appStateUi.lastClickedElement.lastEl.hasAttribute(
    `${ATTR.TASK_TEXT}`,
  );

  const isDescription = appStateUi.lastClickedElement.lastEl.hasAttribute(
    `${ATTR.TASK_DESCRIPTION}`,
  );
  return {
    description,
    taskItemDescription,
    taskItemText,
    clonedTaskInToolbar,
    taskTextEl,
    isDescription,
    isTextTask,
  };
};

export const saveEditedDescriptionAndTask = (toolbar, taskItem, event) => {
  if (!toolbar || !taskItem) return;
  const allElements = getElements(toolbar, taskItem);
  if (!allElements) return;

  saveEditedDescription(allElements);
  saveEditedTask(allElements);
  cleanupDescriptionAndEditUi(toolbar, event);
  updateEditedTask();
};

const updateTaskDescription = (allElements, text, empty) => {
  allElements.description.textContent = text;
  allElements.taskItemDescription.textContent = text;

  appStateUi.taskObjectToEdit.description = empty ?? text;

  allElements.taskItemDescription.dataset.truncateText = text;

  if (allElements.clonedTaskInToolbar) {
    allElements.clonedTaskInToolbar.nextElementSibling.textContent = text;
  }
};

const saveEditedDescription = (allElements) => {
  const inputText = elements.inputElement.textContent;
  const isTaskEl = allElements.isTextTask;

  const isDescriptionLastClicked =
    allElements.isDescription &&
    inputText.trim() !== "" &&
    inputText !== PLACEHOLDERS.DESCRIPTION;

  const isDescriptionUnchanged =
    allElements.isDescription && inputText === PLACEHOLDERS.DESCRIPTION;

  const shouldClearDescription =
    (allElements.description.textContent === PLACEHOLDERS.DESCRIPTION &&
      inputText.trim() === "") ||
    (allElements.description.textContent === PLACEHOLDERS.DESCRIPTION &&
      isTaskEl);

  if (isDescriptionLastClicked) {
    updateTaskDescription(allElements, inputText);
  } else if (isDescriptionUnchanged) {
    updateTaskDescription(allElements, "", null);
  } else if (shouldClearDescription) {
    updateTaskDescription(allElements, "", null);
    /* Sync the updated toolbar description with the main task */
  } else {
    const toolbarDesText = allElements.description.textContent;
    updateTaskDescription(allElements, toolbarDesText);
  }
};

const updateTaskText = (allElements, text) => {
  allElements.taskItemText.textContent = text;
  allElements.taskTextEl.textContent = text;
  allElements.taskItemText.dataset.truncateText = text;
  appStateUi.taskObjectToEdit.text = text;
  if (allElements.clonedTaskInToolbar) {
    allElements.clonedTaskInToolbar.textContent = text;
    allElements.clonedTaskInToolbar.dataset.truncateText = text;
  }
};

const saveEditedTask = (allElements) => {
  const inputText = elements.inputElement.textContent;

  const isTaskTextLastClicked =
    allElements.isTextTask &&
    inputText.trim() !== "" &&
    inputText !== PLACEHOLDERS.EDIT_TASK;

  const isTaskTextEmpty = allElements.isTextTask && inputText.trim() === "";

  if (isTaskTextLastClicked) updateTaskText(allElements, inputText);
  else if (isTaskTextEmpty) {
    updateTaskText(allElements, appStateUi.taskObjectToEdit.text);
  } else if (
    allElements.taskTextEl.textContent.trim() === "" ||
    allElements.taskTextEl.textContent === PLACEHOLDERS.EDIT_TASK
  ) {
    updateTaskText(allElements, allElements.taskItemText.textContent);
  } else updateTaskText(allElements, allElements.taskTextEl.textContent);
};
