import { appStateUi } from "../todos-controller.js/todos-controller.js";
import { toggleKeyboard } from "../keyboard-view/toggle-keyboard.js";

import {
  cleanupDescriptionAndEditUi,
  cleanupEditUi,
  cleanupDescriptionUi,
} from "./dom-operations/shared-cleaningup-edit-and-description-mode-ui.js";
import {
  saveEditedDescriptionAndTask,
  revertTextOfDescriptionAndTaskText,
} from "./dom-operations/operation-on-dom-on-switch-between-edit-and-description-modes.js";
import {
  saveEditedTaskText,
  saveEditedTaskDescription,
} from "./dom-operations/operation-on-dom-on-edit-modes.js";
import {
  detectClickedElementAndGetTaskObject,
  enterDescriptionMode,
  enterEditMode,
} from "./dom-operations/shared-entering-edit-or-description-modes-ui.js";
import { adjustActiveTaskTextWidth } from "./reveal-toolbar.js";

export const implementEditAndDescriptionMode = (event) => {
  const requiredData = detectClickedElementAndGetTaskObject(event);
  if (!requiredData) return;
  appStateUi.originalTaskDescription = requiredData.taskObject.description;
  appStateUi.originalTaskText = requiredData.taskObject.text;
  if (appStateUi.activeMode === "edit-description") {
    enterDescriptionMode(
      requiredData.taskItem.toolbar,
      requiredData.taskObject,
    );
    //update the clickable width of task text area
    adjustActiveTaskTextWidth();
  }

  if (appStateUi.activeMode === "edit-task") {
    enterEditMode(requiredData.taskItem.toolbar, requiredData.taskObject);
  }
  toggleKeyboard(event); // Toggle keyboard - event parameter determines if dismiss overlay is added
};

export const saveEditedTask = (event) => {
  if (!event.target.closest(".task__save-edited-task")) return;
  const toolbar = event.target.closest(".task__toolbar-actions");
  const taskItem = event.target.closest(".task");
  if (!toolbar || !taskItem) return;
  if (appStateUi.activeMode === "edit-task") {
    saveEditedTaskText(toolbar, taskItem, event);
  }

  if (appStateUi.activeMode === "edit-description") {
    saveEditedTaskDescription(toolbar, taskItem, event);
  }

  if (appStateUi.activeMode === "switch") {
    saveEditedDescriptionAndTask(toolbar, taskItem, event);
  }
};

export const exitEditMode = (event) => {
  if (!event.target.closest(".task__cancel-editing")) return;
  const toolbar = event.target.closest(".task__toolbar-actions");
  if (!toolbar) return;
  if (appStateUi.activeMode === "edit-task") {
    cleanupEditUi(toolbar, event);
  }

  if (appStateUi.activeMode === "edit-description") {
    cleanupDescriptionUi(toolbar, event);
  }

  if (appStateUi.activeMode === "switch") {
    cleanupDescriptionAndEditUi(toolbar, event);
    revertTextOfDescriptionAndTaskText(event);
  }
};
