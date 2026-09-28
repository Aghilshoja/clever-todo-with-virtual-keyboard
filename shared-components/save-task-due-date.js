import { EDIT_MODES } from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import {
  exitDateMode,
  exitEditingDate,
} from "./costume-calendar/exit-date-picker.js";
import { quickDateLabels } from "./costume-calendar/quick-date-options.js";
import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import {
  getTaskItem,
  updateDOM,
} from "./costume-calendar/update-task-due-date-view.js";
import { saveMultipleTasksDueDate } from "./set-due-date-on-multiple-tasks.js";
import { appStateUi } from "./todo-states/states.js";

const saveSingleTaskDate = () => {
  const { taskItem, taskId } = getTaskItem();

  lists.default.setDueDate(taskId, appStateUi.draftedDate, appStateUi.hasTime);
  updateDOM(taskItem);
  quickDateLabels.updateLabels();

  exitEditingDate();
  exitDateMode();
  virtualKeyboard.updateAutoCaps();
  appStateUi.activeTaskId = null;
};

const saveTaskDueDate = () => {
  const singleDateMode = appStateUi.activeMode === EDIT_MODES.DATE_MODE;

  const multipleDateMode =
    appStateUi.activeMode === EDIT_MODES.EDIT_MULTIPLE_TASK;

  const editingTaskDate = appStateUi.activeMode === EDIT_MODES.EDIT_TASK_DATE;

  if (singleDateMode || editingTaskDate) {
    saveSingleTaskDate();
  }
  if (multipleDateMode) {
    saveMultipleTasksDueDate();
  }
};

export { saveTaskDueDate };
