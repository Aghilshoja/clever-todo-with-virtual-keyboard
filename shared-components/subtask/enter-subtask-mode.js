import {
  ACTIONS,
  ADD_TASK_MODE,
  ATTR,
  ATTR_STATES,
} from "../../constants/todo-constants.js";
import { toggleKeyboard } from "../../keyboard-view/toggle-keyboard.js";
import { appStateUi } from "../todo-states/states.js";

export const enterSubTaskModeUi = (e) => {
  if (!e.target.closest(`[${ACTIONS.SUB_TASK}]`)) return;

  const sectionItem = e.target.closest(`[${ATTR.SECTION_ITEM}]`);

  if (sectionItem) appStateUi.sectionId = sectionItem.dataset.id;
  if (e.target.dataset.id) appStateUi.taskId = e.target.dataset.id;

  const toolbar = e.target.closest(`[${ATTR.TASK_TOOLBAR}]`);

  if (!toolbar) return;
  toolbar.dataset[ATTR_STATES.TOOLBAR_FULL_HEIGHT] = "";
  toggleKeyboard();
  appStateUi.addTaskModes = ADD_TASK_MODE.SUBTASK;
};
