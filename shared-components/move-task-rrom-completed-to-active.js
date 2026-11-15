import { lists } from "../todos-controller/todos-controller.js";
import { countTasks } from "./count-tasks.js";
import { showUndopopup } from "./undo-completed-task.js";
import {
  disableOrEnableButtons,
  updateCounterAfterCompletingOrUncompletingATask,
} from "./select-tasks.js";
import { ACTIONS, ATTR, UNDO_STATES } from "../constants/todo-constants.js";
import { appStateUi } from "./todo-states/states.js";
import { getOriginalTaskElements } from "./subtask/toggle-subtask-visibility.js";
import {
  getRootParent,
  restoreTaskBranchAfterUncompletion,
} from "./utils/task-uncompletion-utils.js";
import {
  storeUndoInfo,
  updateSingleTaskCompletionUndoMessage,
} from "./utils/task-undo-utils.js";

const countNewlyUncompletedTasks = (rootTask) => {
  const previousStates = appStateUi.undoOperation.previousCompletionStates;

  const currentTasks = [
    rootTask,
    ...lists.default.getAllDescendants(rootTask.id),
  ];

  const currentTasksMap = new Map(currentTasks.map((task) => [task.id, task]));

  let count = 0;

  previousStates.forEach((wasCompleted, taskId) => {
    const currentTask = currentTasksMap.get(taskId);

    if (wasCompleted === true && currentTask?.isCompleted === false) {
      count++;
    }
  });

  return count;
};

export const moveTaskFromCompletedToActive = (event) => {
  const clickedCheckbox = event.target.closest(`[${ACTIONS.UNCOMPLETE_TASK}]`);
  if (!clickedCheckbox) return;
  const taskid = clickedCheckbox.dataset.id;
  if (!taskid) return;

  let activeTaskObject = null;

  appStateUi.undoOperation.detachedElements = getOriginalTaskElements();

  const currentParent = event.currentTarget;
  const sectionId = currentParent.hasAttribute(ATTR.SECTION_ITEM)
    ? currentParent?.dataset.id
    : null;

  const ancestors = lists.default.getAllDescendants(
    getRootParent(taskid, sectionId)?.id,
  );

  const rootParentTask = getRootParent(taskid, sectionId);

  const allTasks = [rootParentTask, ...ancestors];

  appStateUi.undoOperation.ancestors = structuredClone(allTasks);

  appStateUi.undoOperation.previousCompletionStates = new Map();

  appStateUi.undoOperation.ancestors.forEach((subtask) => {
    appStateUi.undoOperation.previousCompletionStates.set(
      subtask?.id,
      subtask?.isCompleted,
    );
  });

  if (event.currentTarget.hasAttribute(ATTR.SECTION_LIST)) {
    const sectionItem = event.currentTarget.closest(`[${ATTR.SECTION_ITEM}]`);
    if (!sectionItem) return;
    const sectionId = sectionItem.dataset.id;
    if (sectionId) {
      activeTaskObject = lists.default.moveTaskFromCompletedToActive(
        taskid,
        sectionId,
      );
    }

    const sectionList = sectionItem.querySelector(`[${ATTR.SECTION_LIST}]`);
    storeUndoInfo(taskid, sectionList);

    if (sectionList)
      restoreTaskBranchAfterUncompletion(
        activeTaskObject,
        sectionList,
        sectionId,
      );
  } else {
    activeTaskObject = lists.default.moveTaskFromCompletedToActive(taskid);
    const tasksContainer = event.currentTarget;
    storeUndoInfo(taskid, tasksContainer);

    if (tasksContainer) {
      restoreTaskBranchAfterUncompletion(activeTaskObject, tasksContainer);
    }
  }

  appStateUi.undoOperation.originalTaskObject = activeTaskObject;

  const numberOfUncompletedTasks = countNewlyUncompletedTasks(rootParentTask);

  countTasks();
  updateSingleTaskCompletionUndoMessage(event, numberOfUncompletedTasks);
  appStateUi.undoOperation.undoType = UNDO_STATES.UNDO_UNCOMPLETED;
  showUndopopup();
  updateCounterAfterCompletingOrUncompletingATask();
  /* disable or enable delete, complete, duplicate operation on tasks when in tasks selection */
  disableOrEnableButtons();
};
