import {
  ATTR,
  CHECK_STATES,
  HIGHLIGHT_SELECTED_TASK,
  UNDO_STATES,
} from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import { countTasks } from "./count-tasks.js";
import { handleEmptyTaskStateUi } from "./delete-mode.js";
import { exitTaskSelection } from "./select-tasks.js";
import { appStateUi } from "./todo-states/states.js";
import { showUndopopup } from "./undo-completed-task.js";
import { restoreTaskBranchAfterUncompletion } from "./utils/task-uncompletion-utils.js";
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

const getUncompletedTasksCount = (currentList) => {
  const subtasks = appStateUi.snapshots.subtasks;
  const rootTasks = appStateUi.snapshots.dataSnapshot;
  const subAndRootTasks = [...rootTasks, ...subtasks];

  const isSectionList = currentList.hasAttribute(ATTR.SECTION_LIST);

  const allTasks = isSectionList
    ? [
        ...lists.default.getSectionList(currentList.dataset.id).tasks,
        ...lists.default.subtasks,
      ]
    : [...lists.default.tasks, ...lists.default.subtasks];

  const previousStates = new Map();

  subAndRootTasks.forEach((task) =>
    previousStates.set(task.id, task.isCompleted),
  );

  let count = 0;

  allTasks.forEach((task) => {
    const previousState = previousStates.get(task.id);

    if (previousState === true && task.isCompleted === false) {
      count++;
    }
  });

  return count;
};

export const handleSeveralTasksUncompletion = () => {
  const selectedTask = document.querySelector(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  if (!selectedTask) return;

  if (selectedTask.dataset.isCompleted !== "true") return;

  appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_SEVERAL_UNCOMPLETED;
  const currentList = captureUndoSnapshot();
  if (!currentList) return;

  const taskIds = Array.from(
    document.querySelectorAll(
      `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
    ),
  ).map((el) => el.dataset.id);

  appStateUi.snapshots.IdsOfSelectedTasks = taskIds;

  let uncompletedTasks;

  const isSectionList = currentList.hasAttribute(ATTR.SECTION_LIST);

  const sectionItem = isSectionList
    ? currentList.closest(`[${ATTR.SECTION_ITEM}]`)
    : null;

  const sectionId = sectionItem?.dataset.id;

  if (isSectionList) {
    uncompletedTasks = lists.default.uncompleteSeveralTasks(taskIds, sectionId);
  } else {
    uncompletedTasks = lists.default.uncompleteSeveralTasks(taskIds);
  }

  uncompletedTasks.forEach((task) =>
    restoreTaskBranchAfterUncompletion(task, currentList, sectionId),
  );

  const count = getUncompletedTasksCount(currentList);

  updateMultipleTasksCompletionUndoMessage("several-uncompletion", count);

  refreshUi();
};
