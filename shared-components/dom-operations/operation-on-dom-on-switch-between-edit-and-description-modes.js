import { getCachedElements } from "../get-cached-element.js";
import { appStateUi } from "../../todos-controller.js/todos-controller.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { cleanupDescriptionAndEditUi } from "./shared-cleaningup-edit-and-description-mode-ui.js";
import { disableOrEnableSaveBtn } from "../handle-disabling-or-enabling-saving-task-edits.js";
import { keyboardUiState } from "../../keyboard-controler/keyboard-controler.js";
import {
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  EDIT_MODES,
  HIDDEN,
  VISIBLE,
} from "../../constants/todo-constants.js";
import {
  PLACEHOLDERS,
  ATTRIBUTES,
} from "../../constants/keyboard-constants.js";
import { getRepetitiveElements } from "./shared-entering-edit-or-description-modes-ui.js";

const elements = getCachedElements();

const editDescription = (descriptionEl, toolbar) => {
  if (!descriptionEl) return;
  const taskText = toolbar.querySelector(`[${ATTR.TASK_TEXT}]`);
  if (!taskText) return;
  const input = elements.inputElement;
  if (!input) return;
  delete taskText.dataset[ATTR_STATES.TASK_TEXT_STATE];
  if (input.textContent !== PLACEHOLDERS.EDIT_TASK) {
    taskText.textContent = input.textContent;
  }

  // Clear visual caret before description edit (prevents double caret bug)
  delete input.dataset[ATTRIBUTES.INPUT_CARET];
  descriptionEl.dataset[ATTR_STATES.DESCRIPTION_STATE] =
    HIDDEN.TASK_DESCRIPTION;
  descriptionEl.after(input);
  if (descriptionEl.textContent === PLACEHOLDERS.DESCRIPTION) {
    input.textContent = PLACEHOLDERS.DESCRIPTION;
    input.dataset[ATTRIBUTES.INPUT_CARET] = "";
  } else {
    input.textContent = "";
    const caret = ensureCaret(input);
    caret.insertAdjacentText("beforebegin", descriptionEl.textContent);
  }
  disableOrEnableSaveBtn();
};

const editTask = (taskEl, toolbar) => {
  if (!taskEl) return;
  const description = toolbar.querySelector(`[${ATTR.TASK_DESCRIPTION}]`);
  if (!description) return;
  const input = elements.inputElement;
  if (!input) return;
  delete description.dataset[ATTR_STATES.DESCRIPTION_STATE];
  if (input.textContent === PLACEHOLDERS.DESCRIPTION) {
    description.textContent = PLACEHOLDERS.DESCRIPTION;
  } else {
    description.textContent = input.textContent;
  }
  taskEl.after(input);
  taskEl.dataset[ATTR_STATES.TASK_TEXT_STATE] = HIDDEN.TASK_TEXT;
  input.textContent = "";
  delete input.dataset[ATTRIBUTES.INPUT_CARET];
  const caret = ensureCaret(input);
  caret.insertAdjacentText("beforebegin", taskEl.textContent);
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

const getElements = (toolbar, taskItem) => {
  const repetitiveEls = getRepetitiveElements(toolbar);
  const taskItemDescription = repetitiveEls.taskItemDescription;
  const toolbarDescription = repetitiveEls.description;
  const taskItemTaskEl = repetitiveEls.taskItemText;
  const toolbarTaskEl = repetitiveEls.taskTextEl;
  if (
    !taskItemTaskEl ||
    !toolbarTaskEl ||
    !toolbarDescription ||
    !taskItemDescription
  )
    return;
  const isTextTask = appStateUi.lastClickedElement.lastEl.hasAttribute(
    `${ATTR.TASK_TEXT}`,
  );

  const isDescription = appStateUi.lastClickedElement.lastEl.hasAttribute(
    `${ATTR.TASK_DESCRIPTION}`,
  );
  return {
    taskItemDescription,
    toolbarDescription,
    toolbarTaskEl,
    taskItemTaskEl,
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
};

const saveEditedDescription = (allElements) => {
  const inputText = elements.inputElement.textContent;
  const toolbarDescriptionEl = allElements.toolbarDescription;
  const taskItemDescriptionEl = allElements.taskItemDescription;
  const isDescription = allElements.isDescription;
  const isTaskEl = allElements.isTextTask;
  /* update model and UI if the description was the element that was last clicked  */
  if (
    isDescription &&
    inputText.trim() !== "" &&
    inputText !== PLACEHOLDERS.DESCRIPTION
  ) {
    taskItemDescriptionEl.textContent = inputText;
    toolbarDescriptionEl.textContent = inputText;
    appStateUi.taskObjectToEdit.description = inputText;
    // sync truncattion attribute with latest data
    taskItemDescriptionEl.dataset.truncateText = inputText;
    /* update model and UI if input = Description, and is still on the still on description mode and not switched */
  } else if (isDescription && inputText === PLACEHOLDERS.DESCRIPTION) {
    taskItemDescriptionEl.textContent = "";
    toolbarDescriptionEl.textContent = "";
    taskItemDescriptionEl.dataset.truncateText = "";
    appStateUi.taskObjectToEdit.description = null;
    /* if  description el = Description  and input = empty or white spcae clear UI and update the model || if description el = Description and switched to edit task text just clear UI and update the model */
  } else if (
    (toolbarDescriptionEl.textContent === PLACEHOLDERS.DESCRIPTION &&
      inputText.trim() === "") ||
    (toolbarDescriptionEl.textContent === PLACEHOLDERS.DESCRIPTION && isTaskEl)
  ) {
    taskItemDescriptionEl.textContent = "";
    toolbarDescriptionEl.textContent = "";
    taskItemDescriptionEl.dataset.truncateText = "";
    appStateUi.taskObjectToEdit.description = null;
    /* if the last clicked element was not the last one meaning text content of the description el has already been updated just update the main task description */
  } else {
    taskItemDescriptionEl.textContent = toolbarDescriptionEl.textContent;
    taskItemDescriptionEl.dataset.truncateText =
      toolbarDescriptionEl.textContent;
    appStateUi.taskObjectToEdit.description = toolbarDescriptionEl.textContent;
  }
};

const saveEditedTask = (allElements) => {
  const inputText = elements.inputElement.textContent;
  const isTaskEl = allElements.isTextTask;
  const toolbarTaskEl = allElements.toolbarTaskEl;
  const taskItemTaskEl = allElements.taskItemTaskEl;
  // update task text if that was the last clicked el
  if (
    isTaskEl &&
    inputText.trim() !== "" &&
    inputText !== PLACEHOLDERS.EDIT_TASK
  ) {
    taskItemTaskEl.textContent = inputText;
    toolbarTaskEl.textContent = inputText;
    taskItemTaskEl.dataset.truncateText = inputText;
    appStateUi.taskObjectToEdit.text = inputText;
    // restore original task text if white spaces added as task text
  } else if (isTaskEl && inputText.trim() === "") {
    taskItemTaskEl.textContent = appStateUi.taskObjectToEdit.text;
    toolbarTaskEl.textContent = appStateUi.taskObjectToEdit.text;
    taskItemTaskEl.dataset.truncateText = appStateUi.taskObjectToEdit.text;
  } else if (toolbarTaskEl.textContent !== PLACEHOLDERS.EDIT_TASK) {
    taskItemTaskEl.textContent = toolbarTaskEl.textContent;
    taskItemTaskEl.dataset.truncateText = toolbarTaskEl.textContent;
    appStateUi.taskObjectToEdit.text = toolbarTaskEl.textContent;
  }
};
