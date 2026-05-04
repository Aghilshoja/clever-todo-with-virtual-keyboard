import { appStateUi } from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";
import { cleanupDescriptionUi } from "./shared-cleaningup-edit-and-description-mode-ui.js";
import { cleanupEditUi } from "./shared-cleaningup-edit-and-description-mode-ui.js";

const elements = getCachedElements();

export const saveEditedTaskText = (toolbar, taskItem, event) => {
  const toolbarTaskText = toolbar.querySelector(".task__toolbar-task-text");
  const taskText = taskItem.querySelector(".task__text");
  if (elements.inputElement.textContent.trim() === "") {
    taskText.textContent = appStateUi.taskObjectToEdit.text;
    toolbarTaskText.textContent = appStateUi.taskObjectToEdit.text;
    taskText.dataset.trucateText = appStateUi.taskObjectToEdit.text;
  } else if (toolbarTaskText && taskText) {
    taskText.textContent = elements.inputElement.textContent;
    toolbarTaskText.textContent = elements.inputElement.textContent;
    appStateUi.taskObjectToEdit.text = elements.inputElement.textContent;
    taskText.dataset.truncateText = elements.inputElement.textContent;
  }
  cleanupEditUi(toolbar, event);
};

export const saveEditedTaskDescription = (toolbar, taskItem, event) => {
  const mainTaskDescription = taskItem.querySelector(".task__description");
  const toolbarTaskDescription = toolbar.querySelector(
    ".task__toolbar-description-text",
  );
  if (elements.inputElement.textContent.trim() === "") {
    mainTaskDescription.textContent = appStateUi.taskObjectToEdit.description;
    mainTaskDescription.dataset.truncateText =
      appStateUi.taskObjectToEdit.description;
    toolbarTaskDescription.textContent =
      appStateUi.taskObjectToEdit.description;
  }
  if (mainTaskDescription && toolbarTaskDescription) {
    mainTaskDescription.textContent = elements.inputElement.textContent;
    toolbarTaskDescription.textContent = elements.inputElement.textContent;
    appStateUi.taskObjectToEdit.description = elements.inputElement.textContent;
    mainTaskDescription.dataset.truncateText =
      elements.inputElement.textContent;
  }
  cleanupDescriptionUi(toolbar, event);
};
