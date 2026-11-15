import { ATTR } from "../../constants/todo-constants.js";
import { lists } from "../../todos-controller/todos-controller.js";
import { updateDOM } from "./task-dom-utils.js";

const prepareDOM = (taskObject) => {
  const OPERATION_TYPE = "uncompletion";

  const fragment = updateDOM(taskObject, OPERATION_TYPE);

  return fragment;
};

const appendTaskToCorrectList = (taskObject, currentList) => {
  const SUBTASKS_CON = ATTR.SUBTASKS_CONTAINER;
  const fragment = prepareDOM(taskObject);
  if ("parentTaskId" in taskObject) {
    const parentEl = document.querySelector(
      `[${ATTR.TASK_ITEM}][data-id="${taskObject.parentTaskId}"]:not([${SUBTASKS_CON}] *)`,
    );

    if (parentEl) parentEl.after(fragment);
  } else if (currentList) currentList.prepend(fragment);
};

export const areAllTasksCompleted = (tasks) => {
  if (tasks.length === 0) return false;

  return tasks.every((task) => task?.isCompleted === true);
};

const excludeHighestAncestor = (ancestors, parentAncestor) =>
  ancestors.filter((task) => task.id !== parentAncestor.id);

const hasCompletedIntermediateAncestor = (ancestors, parentAncestor) => {
  if (ancestors.length === 0) return false;
  const excludedParent = excludeHighestAncestor(ancestors, parentAncestor);

  return excludedParent.some((task) => task.isCompleted === true);
};

const activateAncestorsAndPreserveCompletedDescendants = (
  ancestors,
  activeTaskObject,
) => {
  ancestors.forEach((task) => (task.isCompleted = false));

  const descendants = lists.default.getAllDescendants(activeTaskObject.id);
  descendants.forEach((task) => (task.isCompleted = true));
};

const restoreBranchSiblingOrder = (
  parentAncestor,
  activeTaskObject,
  ancestors,
) => {
  const parentEl = document.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${parentAncestor.id}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
  );

  if (!parentEl) return;

  const directlyClickedEl = document.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${activeTaskObject.id}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
  );

  const clickedElSiblings = lists.default.subtasks.filter(
    (task) => task.parentTaskId === activeTaskObject.parentTaskId,
  );

  const taskEls = Array.from(
    document.querySelectorAll(
      `[${ATTR.TASK_ITEM}]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
    ),
  );

  const taskIds = new Set(clickedElSiblings.map((task) => task.id));

  const siblingEls = taskEls.filter((task) => taskIds.has(task.dataset.id));

  const firstSibling = siblingEls[0];

  const startingPointEl =
    siblingEls.length === 0 ? directlyClickedEl : firstSibling;

  if (startingPointEl) {
    let previousEl = startingPointEl.previousElementSibling;

    while (previousEl && previousEl.dataset.isCompleted === "false") {
      const isCompleted =
        previousEl?.previousElementSibling?.dataset.isCompleted === "true";

      if (isCompleted) break;

      previousEl = previousEl.previousElementSibling;
    }

    const localParent = ancestors.find(
      (task) => task.id === previousEl?.dataset.id,
    );

    const fragment = localParent
      ? prepareDOM(localParent)
      : prepareDOM(activeTaskObject);

    parentEl.after(fragment);

    const immediateParentEl = document.querySelector(
      `[${ATTR.TASK_ITEM}][data-id="${activeTaskObject.parentTaskId}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
    );

    if (immediateParentEl) {
      const directlyClickedEl = prepareDOM(activeTaskObject);
      immediateParentEl.after(directlyClickedEl);
    }
  }
};

const restoreRootTaskToActiveList = (
  rootTask,
  tasksContainer,
  parentAncestor,
  activeTaskObject,
  ancestors,
) => {
  rootTask.isCompleted = false;

  const rootTaskElement = prepareDOM(rootTask);

  tasksContainer.prepend(rootTaskElement);

  const highestAncestor = parentAncestor || activeTaskObject;

  const fragment = prepareDOM(highestAncestor);
  const rootParentEl = document.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${rootTask.id}"]`,
  );

  if (rootParentEl) {
    rootParentEl.after(fragment);
  }

  if (parentAncestor && parentAncestor.id !== activeTaskObject.id) {
    restoreBranchSiblingOrder(parentAncestor, activeTaskObject, ancestors);
  }
};

const restoreAncestorBranchAfterRoot = (
  parentAncestor,
  rootTask,
  activeTaskObject,
  ancsectors,
) => {
  const fragment = prepareDOM(parentAncestor);

  const rootParentEl = document.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${rootTask.id}"]`,
  );

  if (rootParentEl) rootParentEl.after(fragment);

  restoreBranchSiblingOrder(parentAncestor, activeTaskObject, ancsectors);
};

const activateIntermediateAncestorsAndPreserveCompletedDescendants = (
  intermediateAncestors,
  activeTaskObject,
) => {
  intermediateAncestors.forEach((task) => (task.isCompleted = false));

  const descendants = lists.default.getAllDescendants(activeTaskObject.id);
  descendants.forEach((task) => (task.isCompleted = true));
};

const restoreBranchAfterAncestor = (
  branchRoot,
  parentAncestor,
  activeTaskObject,
) => {
  const fragment = prepareDOM(branchRoot);

  const parentElement = document.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${parentAncestor.id}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
  );

  if (parentElement) {
    parentElement.after(fragment);
  }

  const parentEl = document.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${activeTaskObject.parentTaskId}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
  );

  if (parentEl) {
    const fragment = prepareDOM(activeTaskObject);
    parentEl.after(fragment);
  }
};

export const restoreTaskBranchAfterUncompletion = (
  activeTaskObject,
  tasksContainer,
  sectionId,
) => {
  const rootTaskOb = getRootParent(activeTaskObject.id, sectionId);

  const { ancestors, parentAncestor } = lists.default.getAncestorChain(
    activeTaskObject,
    activeTaskObject.parentTaskId,
  );

  if (rootTaskOb.isCompleted) {
    activateAncestorsAndPreserveCompletedDescendants(
      ancestors,
      activeTaskObject,
    );
    restoreRootTaskToActiveList(
      rootTaskOb,
      tasksContainer,
      parentAncestor,
      activeTaskObject,
      ancestors,
    );
  } else if (areAllTasksCompleted(ancestors)) {
    activateAncestorsAndPreserveCompletedDescendants(
      ancestors,
      activeTaskObject,
    );

    restoreAncestorBranchAfterRoot(
      parentAncestor,
      rootTaskOb,
      activeTaskObject,
      ancestors,
    );
  } else if (hasCompletedIntermediateAncestor(ancestors, parentAncestor)) {
    const excludedParent = excludeHighestAncestor(ancestors, parentAncestor);
    const AreAllSubCompleted =
      excludedParent.length > 0
        ? excludedParent.every((task) => task.isCompleted === true)
        : false;

    if (AreAllSubCompleted) {
      activateIntermediateAncestorsAndPreserveCompletedDescendants(
        excludedParent,
        activeTaskObject,
      );

      const localParent = ancestors.find(
        (task) => task.parentTaskId === parentAncestor.id,
      );

      if (localParent) {
        restoreBranchAfterAncestor(
          localParent,
          parentAncestor,
          activeTaskObject,
        );
      }
    } else {
      const immediateParent = ancestors.find(
        (task) => task.id === activeTaskObject.parentTaskId,
      );

      const parentOfImmediateParent = excludedParent.find(
        (task) => task.id === immediateParent.parentTaskId,
      );

      immediateParent.isCompleted = false;
      parentOfImmediateParent.isCompleted = false;

      const mainParentEl = document.querySelector(
        `[${ATTR.TASK_ITEM}][data-id="${parentOfImmediateParent.id}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
      );

      if (mainParentEl) {
        const fragment = prepareDOM(immediateParent);
        mainParentEl.after(fragment);

        const uncompletedTaskEl = prepareDOM(activeTaskObject);

        const parentEl = document.querySelector(
          `[${ATTR.TASK_ITEM}][data-id="${immediateParent.id}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
        );

        if (parentEl) {
          parentEl.after(uncompletedTaskEl);
        }
      }
    }
  } else appendTaskToCorrectList(activeTaskObject, tasksContainer);
};

export const getRootParent = (taskId, sectionId) => {
  const rootParentId = lists.default.getRootParentId(taskId);

  if (rootParentId) return lists.default.getTask(rootParentId, sectionId);
};
