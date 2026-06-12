import { appStateUi } from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";
import { cleanupDescriptionUi } from "./shared-cleaningup-edit-and-description-mode-ui.js";
import { cleanupEditUi } from "./shared-cleaningup-edit-and-description-mode-ui.js";
import { getRepetitiveElements } from "./shared-entering-edit-or-description-modes-ui.js";

const elements = getCachedElements();

export const saveEditedTaskText = (toolbar, taskItem, event) => {
  const repetitiveEls = getRepetitiveElements(toolbar);

  const toolbarTaskText = repetitiveEls.taskTextEl;
  const taskText = repetitiveEls.taskItemText;
  if (!toolbarTaskText || !taskText) return;

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
  const repetitiveEls = getRepetitiveElements(toolbar);
  const mainTaskDescription = repetitiveEls.taskItemDescription;
  const toolbarTaskDescription = repetitiveEls.description;
  if (!toolbarTaskDescription || !mainTaskDescription) return;

  if (elements.inputElement.textContent.trim() === "") {
    mainTaskDescription.textContent = appStateUi.taskObjectToEdit.description;
    mainTaskDescription.dataset.truncateText =
      appStateUi.taskObjectToEdit.description;
    toolbarTaskDescription.textContent =
      appStateUi.taskObjectToEdit.description;
  } else if (mainTaskDescription && toolbarTaskDescription) {
    mainTaskDescription.textContent = elements.inputElement.textContent;
    toolbarTaskDescription.textContent = elements.inputElement.textContent;
    appStateUi.taskObjectToEdit.description = elements.inputElement.textContent;
    mainTaskDescription.dataset.truncateText =
      elements.inputElement.textContent;
  }
  cleanupDescriptionUi(toolbar, event);
};
