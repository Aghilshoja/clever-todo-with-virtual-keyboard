import {
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  DUE_DATE_STATES,
  EDIT_MODES,
} from "../constants/todo-constants.js";
import { appStateUi, lists } from "../todos-controller.js/todos-controller.js";
import { daysOfWeek, months } from "./costume-calendar/create-calendar.js";
import {
  exitDateMode,
  exitEditingDate,
} from "./costume-calendar/exit-date-picker.js";
import { quickDateLabels } from "./costume-calendar/quick-date-options.js";
import { format24HourTime } from "./costume-calendar/prepare-date-editor.js";
import { getCachedElements } from "./get-cached-element.js";
import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import {
  getTaskItem,
  updateDOM,
} from "./costume-calendar/update-task-due-date-view.js";

const elements = getCachedElements();

const saveTaskDueDate = () => {
  const { taskItem, taskId } = getTaskItem();

  lists.default.setDueDate(taskId, appStateUi.draftedDate, appStateUi.hasTime);
  updateDOM(taskItem);
  quickDateLabels.updateLabels();

  exitEditingDate();
  exitDateMode();
  virtualKeyboard.updateAutoCaps();
  appStateUi.activeTaskId = null;
};

export { saveTaskDueDate };
