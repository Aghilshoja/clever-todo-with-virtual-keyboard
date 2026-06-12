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
import {
  ACTIONS,
  ACTIVE,
  ATTR,
  EDIT_MODES,
} from "../constants/todo-constants.js";

export const implementEditAndDescriptionMode = (event) => {
  const requiredData = detectClickedElementAndGetTaskObject(event);
  if (!requiredData) return;
  appStateUi.originalTaskDescription = requiredData.taskObject.description;
  appStateUi.originalTaskText = requiredData.taskObject.text;
  if (appStateUi.activeMode === EDIT_MODES.DESCRIPTION) {
    enterDescriptionMode(
      requiredData.taskItem.toolbar,
      requiredData.taskObject,
    );
    //update the clickable width of task text area
    adjustActiveTaskTextWidth();
  }

  if (appStateUi.activeMode === EDIT_MODES.EDIT_TASK) {
    enterEditMode(requiredData.taskItem.toolbar, requiredData.taskObject);
  }
  toggleKeyboard(event); // Toggle keyboard - event parameter determines if dismiss overlay is added
};

export const saveEditedTask = (event) => {
  if (!event.target.closest(`[${ACTIONS.SAVE_EDIT}]`)) return;
  const toolbar = event.target.closest(`[${ATTR.TASK_TOOLBAR}]`);
  const taskItem = event.target.closest(`[${ATTR.TASK_ITEM}]`);
  if (!toolbar || !taskItem) return;
  if (appStateUi.activeMode === EDIT_MODES.EDIT_TASK) {
    saveEditedTaskText(toolbar, taskItem, event);
  }

  if (appStateUi.activeMode === EDIT_MODES.DESCRIPTION) {
    saveEditedTaskDescription(toolbar, taskItem, event);
  }

  if (appStateUi.activeMode === EDIT_MODES.SWITCH_BETWEEN_MODES) {
    saveEditedDescriptionAndTask(toolbar, taskItem, event);
  }
};

export const exitEditMode = (event) => {
  if (!event.target.closest(`[${ACTIONS.EXIT_EDIT}]`)) return;
  const toolbar = event.target.closest(`[${ATTR.TASK_TOOLBAR}]`);
  if (!toolbar) return;
  if (appStateUi.activeMode === EDIT_MODES.EDIT_TASK) {
    cleanupEditUi(toolbar, event);
  }

  if (appStateUi.activeMode === EDIT_MODES.DESCRIPTION) {
    cleanupDescriptionUi(toolbar, event);
  }

  if (appStateUi.activeMode === EDIT_MODES.SWITCH_BETWEEN_MODES) {
    cleanupDescriptionAndEditUi(toolbar, event);
    revertTextOfDescriptionAndTaskText(event);
  }
};
