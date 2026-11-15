import {
  ATTR,
  CHECK_STATES,
  HIGHLIGHT_SELECTED_TASK,
  UNDO_STATES,
} from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import { showEmptyStateWhenNoVisibleTasks } from "./complete-mode.js";
import { countTasks } from "./count-tasks.js";
import { handleEmptyTaskStateUi } from "./delete-mode.js";
import { exitTaskSelection } from "./select-tasks.js";
import { appStateUi } from "./todo-states/states.js";
import { showUndopopup } from "./undo-completed-task.js";
import { putSubtaskAtTheEnd } from "./utils/task-dom-utils.js";
import {
  captureUndoSnapshot,
  updateMultipleTasksCompletionUndoMessage,
} from "./utils/task-undo-utils.js";

export const refreshUi = () => {
  countTasks();
  handleEmptyTaskStateUi();
  showUndopopup();
  exitTaskSelection();
};

export const handleSeveralTasksCompletion = () => {
  const selectedTask = document.querySelector(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  if (!selectedTask) return;

  if (selectedTask.dataset.isCompleted === "true") return;

  appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_SEVERAL_COMPLETED;
  const currentList = captureUndoSnapshot();
  if (!currentList) return;

  const taskIds = Array.from(
    document.querySelectorAll(
      `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
    ),
  ).map((el) => el.dataset.id);

  appStateUi.snapshots.IdsOfSelectedTasks = taskIds;

  let sectionId;

  if (currentList.hasAttribute(ATTR.SECTION_LIST)) {
    const sectionItem = currentList.closest(`[${ATTR.SECTION_ITEM}]`);
    if (!sectionItem) return;

    sectionId = sectionItem.dataset.id;
  }

  const { tasksToRebuild, completedTasksCount } =
    lists.default.markSeveralTasksAsCompleted(taskIds, sectionId);

  tasksToRebuild.forEach((task) => {
    putSubtaskAtTheEnd(task, currentList);
  });

  updateMultipleTasksCompletionUndoMessage(
    "several-completion",
    completedTasksCount,
  );

  refreshUi();
  showEmptyStateWhenNoVisibleTasks();
};
