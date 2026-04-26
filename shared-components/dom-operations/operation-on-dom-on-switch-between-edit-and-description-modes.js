import { getCachedElements } from "../get-cached-element.js";
import {
  appStateUi,
  lists,
} from "../../todos-controller.js/todos-controller.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { cleanupDescriptionAndEditUi } from "./shared-cleaningup-edit-and-description-mode-ui.js";
import { disableOrEnableSaveBtn } from "../handle-disabling-or-enabling-saving-task-edits.js";
const elements = getCachedElements();

const editDescription = (descriptionEl, toolbar) => {
  if (!descriptionEl) return;
  const taskText = toolbar.querySelector(".task__toolbar-task-text");
  if (!taskText) return;
  const input = elements.inputElement;
  taskText.classList.remove("hide-task-text");
  if (input.textContent !== "Edit your task") {
    taskText.textContent = input.textContent;
  }
  const doesCaretExist = input.classList.contains(
    "keyboard-section__task-input--caret",
  );

  // Clear visual caret before description edit (prevents double caret bug)
  if (doesCaretExist)
    input.classList.remove("keyboard-section__task-input--caret");
  descriptionEl.classList.add("hide-task-description");
  descriptionEl.after(input);
  if (descriptionEl.textContent === "Description") {
    input.textContent = "Description";
    input.classList.add("keyboard-section__task-input--caret");
  } else {
    input.textContent = "";
    const caret = ensureCaret(input);
    caret.insertAdjacentText("beforebegin", descriptionEl.textContent);
  }
  disableOrEnableSaveBtn();
};

const editTask = (taskEl, toolbar) => {
  if (!taskEl) return;
  const description = toolbar.querySelector(".task__toolbar-description-text");
  if (!description) return;
  const input = elements.inputElement;
  description.classList.remove("hide-task-description");
  if (input.textContent === "Description") {
    description.textContent = "Description";
  } else {
    description.textContent = input.textContent;
  }
  taskEl.after(input);
  taskEl.classList.add("hide-task-text");
  input.textContent = "";
  input.classList.remove("keyboard-section__task-input--caret");
  const caret = ensureCaret(input);
  caret.insertAdjacentText("beforebegin", taskEl.textContent);
};

/**
 * Cancel switch mode: restore toolbar text from main task item
 * (main task item never changed during edit)
 */
export const revertTextOfDescriptionAndTaskText = (event) => {
  const taskItem = event.target.closest(".task");
  if (!taskItem) return;
  const taskText = taskItem.querySelector(".task__text");
  if (!taskText) return;
  const toolbarTaskText = taskItem.querySelector(".task__toolbar-task-text");
  if (!toolbarTaskText) return;
  toolbarTaskText.textContent = taskText.textContent;
  const taskItemDescription = taskItem.querySelector(".task__description");
  if (!taskItemDescription) return;
  const toolbarDescription = taskItem.querySelector(
    ".task__toolbar-description-text",
  );
  if (!toolbarDescription) return;
  toolbarDescription.textContent = taskItemDescription.textContent;
};

export const editDescriptionAndTask = (event) => {
  const isToolbarActive = event.target.closest(".toolbar--active");
  if (!isToolbarActive) return;

  const isTaskClicked = event.target.closest(".task__toolbar-task-text");

  const isDescriptionClicked = event.target.closest(
    ".task__toolbar-description-text",
  );

  if (!isDescriptionClicked && !isTaskClicked) return;

  const mixTarget = isDescriptionClicked || isTaskClicked;
  appStateUi.lastClickedElement.lastEl = mixTarget;

  appStateUi.activeMode = "switch";

  if (isDescriptionClicked) {
    editDescription(isDescriptionClicked, isToolbarActive);
    appStateUi.activePlaceholder = "Description";
  } else if (isTaskClicked) {
    editTask(isTaskClicked, isToolbarActive);
    appStateUi.activePlaceholder = "Edit-your-task";
  }
};

const getElements = (toolbar, taskItem) => {
  const taskItemDescription = taskItem.querySelector(".task__description");
  const toolbarDescription = toolbar.querySelector(
    ".task__toolbar-description-text",
  );
  if (!toolbarDescription || !taskItemDescription) return;
  const taskItemTaskEl = taskItem.querySelector(".task__text");
  const toolbarTaskEl = toolbar.querySelector(".task__toolbar-task-text");
  if (!taskItemTaskEl || !toolbarTaskEl) return;
  const isTextTask = appStateUi.lastClickedElement.lastEl.classList.contains(
    "task__toolbar-task-text",
  );

  const isDescription = appStateUi.lastClickedElement.lastEl.classList.contains(
    "task__toolbar-description-text",
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
  if (isDescription && inputText.trim() !== "" && inputText !== "Description") {
    taskItemDescriptionEl.textContent = inputText;
    toolbarDescriptionEl.textContent = inputText;
    appStateUi.taskObjectToEdit.description = inputText;
    /* update model and UI if input = Description, and is still on the still on description mode and not switched */
  } else if (isDescription && inputText === "Description") {
    taskItemDescriptionEl.textContent = "";
    toolbarDescriptionEl.textContent = "";
    appStateUi.taskObjectToEdit.description = null;
    /* if  description el = Description  and input = empty or white spcae clear UI and update the model || if description el = Description and switched to edit task text just clear UI and update the model */
  } else if (
    (toolbarDescriptionEl.textContent === "Description" &&
      inputText.trim() === "") ||
    (toolbarDescriptionEl.textContent === "Description" && isTaskEl)
  ) {
    taskItemDescriptionEl.textContent = "";
    toolbarDescriptionEl.textContent = "";
    appStateUi.taskObjectToEdit.description = null;
    /* if the last clicked element was not the last one meaning text content of the description el has already been updated just update the main task description */
  } else {
    taskItemDescriptionEl.textContent = toolbarDescriptionEl.textContent;
    appStateUi.taskObjectToEdit.description = toolbarDescriptionEl.textContent;
  }
};

const saveEditedTask = (allElements) => {
  const inputText = elements.inputElement.textContent;
  const isTaskEl = allElements.isTextTask;
  const toolbarTaskEl = allElements.toolbarTaskEl;
  const taskItemTaskEl = allElements.taskItemTaskEl;
  // update task text if that was the last clicked el
  if (isTaskEl && inputText.trim() !== "" && inputText !== "Edit your task") {
    taskItemTaskEl.textContent = inputText;
    toolbarTaskEl.textContent = inputText;
    appStateUi.taskObjectToEdit.text = inputText;
    // restore original task text if white spaces added as task text
  } else if (isTaskEl && inputText.trim() === "") {
    taskItemTaskEl.textContent = appStateUi.taskObjectToEdit.text;
    toolbarTaskEl.textContent = appStateUi.taskObjectToEdit.text;
  } else if (toolbarTaskEl.textContent !== "Edit your task") {
    taskItemTaskEl.textContent = toolbarTaskEl.textContent;
    appStateUi.taskObjectToEdit.text = toolbarTaskEl.textContent;
  }
};
