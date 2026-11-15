import { ATTR } from "../constants/todo-constants.js";
import { lists } from "../todos-controller/todos-controller.js";
import { countTasks } from "./count-tasks.js";
import { renderTask } from "./render-tasks.js";
import { appStateUi } from "./todo-states/states.js";
import {
  hideUndoPopup,
  removeTaskEmptyState,
  removeTaskItemForUndo,
} from "./undo-completed-task.js";
import {
  getSubtaskInsertionAnchor,
  updateDOM,
} from "./utils/task-dom-utils.js";
import {
  areAllTasksCompleted,
  getRootParent,
} from "./utils/task-uncompletion-utils.js";

const buildDOM = (currentList, task, previousStateInfo) => {
  const fragment = updateDOM(
    task,
    "undo-uncompletion",
    appStateUi.undoOperation.detachedElements,
  );
  const taskId = previousStateInfo.previousElId || previousStateInfo.nextElId;

  const taskEl = currentList.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${taskId}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
  );

  if (!taskEl) {
    currentList.appendChild(fragment);
    return;
  }

  if (previousStateInfo.previousElId) taskEl.after(fragment);
  else taskEl.before(fragment);
};

const getHighestSubtaskAncestor = (task, allSubtasks) => {
  let current = task;

  while (true) {
    const parent = allSubtasks.find((s) => s.id === current.parentTaskId);
    if (!parent) break;

    current = parent;
  }

  return current;
};

const createUndoneTasks = (currentList, taskObject, previousStateInfo) => {
  let sectionId = currentList.hasAttribute(ATTR.SECTION_ITEM)
    ? currentList.dataset.id
    : null;
  const rootParent = getRootParent(taskObject.id, sectionId);

  const ancestors = appStateUi.undoOperation.ancestors;
  const isRootParent = rootParent?.id === taskObject?.id;

  if (areAllTasksCompleted(ancestors) && isRootParent) {
    buildDOM(currentList, rootParent, previousStateInfo);
  } else if (areAllTasksCompleted(ancestors)) {
    rootParent.isCompleted = true;
    buildDOM(currentList, rootParent, previousStateInfo);
  } else if (!rootParent?.isCompleted) {
    const completedTasks = ancestors.filter(
      (task) => task?.isCompleted === true,
    );

    const topmostAncestor = getHighestSubtaskAncestor(
      taskObject,
      completedTasks,
    );

    const { toolbarSubtaskContainer } = appStateUi.undoOperation.currentList;

    const fragment = updateDOM(
      topmostAncestor,
      "undo-uncompletion",
      appStateUi.undoOperation.detachedElements,
    );

    const parentEl = currentList.querySelector(
      `[${ATTR.TASK_ITEM}][data-id="${topmostAncestor.parentTaskId}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
    );

    if (parentEl) parentEl.after(fragment);
    else {
      const lastSubtaskOfRootEl = getSubtaskInsertionAnchor(
        taskObject,
        currentList,
      );
      if (lastSubtaskOfRootEl) {
        lastSubtaskOfRootEl.after(fragment);
      }
    }

    if (toolbarSubtaskContainer) {
      const toolbarCompletedSubtask = buildToolBarSubtask(topmostAncestor);

      toolbarSubtaskContainer
        .querySelector(`[${ATTR.TASK_ITEM}][data-id="${topmostAncestor.id}"]`)
        ?.remove();

      toolbarSubtaskContainer.appendChild(toolbarCompletedSubtask);
    }
  }
};

const buildToolBarSubtask = (task) => {
  const template = document.createElement("ul");
  template.innerHTML = renderTask(task);
  const taskItem = template.firstElementChild;

  return taskItem;
};

export const undoUncompletedTask = () => {
  const originalTaskObject = appStateUi.undoOperation.originalTaskObject;

  removeTaskItemForUndo();

  const { currentlist } = appStateUi.undoOperation.currentList;

  if (currentlist) {
    const previousStateInfo = appStateUi.undoOperation.taskIDs;

    lists.default.undoUncompletedTask(
      originalTaskObject,
      appStateUi.undoOperation.previousCompletionStates,
      appStateUi.undoOperation.ancestors,
    );
    createUndoneTasks(currentlist, originalTaskObject, previousStateInfo);
  }

  hideUndoPopup();
  countTasks(); // update badge of active tasks
  removeTaskEmptyState();
};
