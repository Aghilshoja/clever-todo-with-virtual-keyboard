import {
  ATTR_STATES,
  CHECK_STATES,
  HIGHLIGHT_SELECTED_TASK,
  UNDO_STATES,
} from "../constants/todo-constants.js";
import { appStateUi } from "../todos-controller.js/todos-controller.js";
import { showNumberOfCompletedTasks } from "./complete-mode.js";
import { countTasks } from "./count-tasks.js";
import { handleEmptyTaskStateUi } from "./delete-mode.js";
import { hideUndoPopup } from "./undo-completed-task.js";
import { undoSeveralCompletedTasks } from "./undo-several-completed-tasks.js";
import { undoSeveralUncompletedTasks } from "./undo-several-uncompleted-tasks.js";

export const handleSeveralCompletedAndUncompletedTasksUndo = () => {
  const isUndoSeveralCompletedTasksActive =
    appStateUi.undoOperation.undoType === UNDO_STATES.UNDO_SEVERAL_COMPLETED;

  const isUndoSeveralUncompletedTasksActive =
    appStateUi.undoOperation.undoType === UNDO_STATES.UNDO_SEVERAL_UNCOMPLETED;

  if (isUndoSeveralCompletedTasksActive) {
    undoSeveralCompletedTasks();
  } else if (isUndoSeveralUncompletedTasksActive) {
    undoSeveralUncompletedTasks();
  }
};

export const removeSelectedTasksHighlightedTasks = () => {
  const selectedTasks = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  appStateUi.snapshots.domSnapshot.forEach((task) => {
    if (
      task.dataset[ATTR_STATES.HIGHLIGHT_SELECTED_TASK] ===
      HIGHLIGHT_SELECTED_TASK.SELECTED
    )
      delete task.dataset[ATTR_STATES.HIGHLIGHT_SELECTED_TASK];
  });
};

export const refreshUiAfterUndo = () => {
  showNumberOfCompletedTasks();
  countTasks();
  hideUndoPopup();
  handleEmptyTaskStateUi();
};
