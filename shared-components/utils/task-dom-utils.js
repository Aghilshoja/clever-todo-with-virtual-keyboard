import {
  ACTIONS,
  ATTR,
  ATTR_STATES,
  VISIBLE,
} from "../../constants/todo-constants.js";
import { elements, lists } from "../../todos-controller/todos-controller.js";
import { renderTask } from "../render-tasks.js";
import {
  handleMaxSubTaskLimit,
  renderSubtaskInItsParentToolbar,
} from "../subtask/add-subtask.js";
import { getOriginalTaskElements } from "../subtask/toggle-subtask-visibility.js";

const applyCompletedTaskVisibility = (taskElement) => {
  const shouldCompletedTasksBeVisible =
    elements.showCompletedTasksBtn.dataset.isVisible === "true";

  if (shouldCompletedTasksBeVisible)
    taskElement.dataset.completedTaskVisiblity = false;
  else taskElement.dataset.completedTaskVisiblity = true;
};

export const createTaskItem = (task) => {
  const template = document.createElement("div");
  template.innerHTML = renderTask(task);
  const taskItem = template.firstElementChild;
  taskItem.dataset.isCompleted = true;

  applyCompletedTaskVisibility(taskItem);

  return taskItem;
};

const removeTaskTreeFromDOM = (taskObject) => {
  const descendants = lists.default.getAllDescendants(taskObject.id);
  const taskIds = new Set([
    taskObject.id,
    ...descendants.map((task) => task.id),
  ]);

  document.querySelectorAll(`[${ATTR.TASK_ITEM}]`).forEach((element) => {
    if (taskIds.has(element.dataset.id)) {
      element.remove();
    }
  });
};

export const addSubtaskToggler = (parentTaskEl, subtasks) => {
  if (subtasks.length === 0) return;

  const mainSubTasksTogglerContainer = parentTaskEl.querySelector(
    `[${ATTR.MAIN_SUBTASK_TOGGLER_CONTAINER}]`,
  );

  if (mainSubTasksTogglerContainer) {
    const subTaskTogglerBtn = mainSubTasksTogglerContainer.querySelector(
      `[${ACTIONS.SUBTASK_TOGGLER}]`,
    );
    if (subTaskTogglerBtn)
      subTaskTogglerBtn.dataset[ATTR_STATES.MAIN_SUBTASK_TOGGLER] =
        VISIBLE.SUBTASK_TOGGLER;
  }

  const toolbarsubTaskTogglerEl = parentTaskEl.querySelector(
    `[${ACTIONS.TOOLBAR_SUBTASKS_TOGGLER}]`,
  );
  if (toolbarsubTaskTogglerEl)
    toolbarsubTaskTogglerEl.dataset[ATTR_STATES.TOOLBAR_SUBTASK_TOGGLER] =
      VISIBLE.SUBTASK_TOGGLER;
};

const applySubtaskIndentation = (taskElement, taskObject) => {
  if (!("parentTaskId" in taskObject)) return;

  const depth = lists.default.getSubtaskDepth(taskObject.parentTaskId);

  handleMaxSubTaskLimit(taskElement, depth);

  const nestingIndentEl = taskElement.querySelector(`[${ATTR.SUBTASK_INDENT}]`);

  if (nestingIndentEl) {
    nestingIndentEl.style.marginLeft = `${depth}rem`;
  }
};

const createCompletedSubtaskElement = (subtask) => {
  const taskElement = createTaskItem(subtask);

  if (subtask.parentTaskId) {
    taskElement.dataset.parentTaskId = subtask.parentTaskId;
    taskElement.dataset[ATTR_STATES.SUBTASKS] = VISIBLE.SUBTASKS;
  }

  applySubtaskIndentation(taskElement, subtask);

  return taskElement;
};

export const getSubtaskInsertionAnchor = (taskObject, targetContainer) => {
  const parentId = taskObject.parentTaskId;

  if (!parentId) return null;

  const parentElement = [
    ...targetContainer.querySelectorAll(
      `[${ATTR.TASK_ITEM}]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
    ),
  ].find((element) => element.dataset.id === parentId);

  if (!parentElement) return null;

  const directChildren = lists.default
    .getAllDescendants(parentId)
    .filter(
      (task) => task.parentTaskId === parentId && task.id !== taskObject.id,
    );

  const taskElements = [
    ...targetContainer.querySelectorAll(
      `[${ATTR.TASK_ITEM}]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
    ),
  ];

  const directChildIds = new Set(directChildren.map((task) => task.id));

  // Find the last remaining direct child in DOM order.
  const lastDirectChild = taskElements
    .filter((element) => directChildIds.has(element.dataset.id))
    .at(-1);

  // If there are no remaining children, insert after the parent.
  if (!lastDirectChild) return parentElement;

  // Find the end of that child's entire subtree.
  const subtreeIds = new Set([
    lastDirectChild.dataset.id,
    ...lists.default
      .getAllDescendants(lastDirectChild.dataset.id)
      .map((task) => task.id),
  ]);

  return (
    taskElements
      .filter((element) => subtreeIds.has(element.dataset.id))
      .at(-1) ?? lastDirectChild
  );
};

const fixDecendantsOrder = (descendants, operationType, detachedElements) => {
  const orderedDescendants = [];
  if (operationType === "duplication") {
    document.querySelectorAll(`[data-duplicated-id]`).forEach((el) => {
      const task = descendants.find(
        (task) => task.id === el.dataset.duplicatedId,
      );

      if (task) orderedDescendants.push(task);
    });

    return orderedDescendants;
  }

  // Existing implementation...
  const detachedDOMElements =
    operationType === "undo-uncompletion"
      ? detachedElements
      : getOriginalTaskElements();

  detachedDOMElements.forEach((el) => {
    const task = descendants.find((task) => task.id === el.dataset.id);

    if (task) {
      orderedDescendants.push(task);
    }
  });
  return orderedDescendants;
};

export const buildActiveTask = (task) => {
  const template = document.createElement("ul");
  template.innerHTML = renderTask(task);
  const taskItem = template.firstElementChild;

  if ("parentTaskId" in task) {
    taskItem.dataset.parentTaskId = task.parentTaskId;
    taskItem.dataset[ATTR_STATES.SUBTASKS] = VISIBLE.SUBTASKS;
  }

  applySubtaskIndentation(taskItem, task);

  return taskItem;
};

export const updateDOM = (taskObject, operationType, detachedElements) => {
  const descendants = lists.default.getAllDescendants(taskObject.id);

  const orderdDecendants = fixDecendantsOrder(
    descendants,
    operationType,
    detachedElements,
  );

  const allTasks = [taskObject, ...orderdDecendants];

  const renderedTasks = new Map();

  removeTaskTreeFromDOM(taskObject);

  const fragment = document.createDocumentFragment();

  allTasks.forEach((subtask) => {
    let element =
      subtask.isCompleted === true
        ? createCompletedSubtaskElement(subtask)
        : buildActiveTask(subtask);

    renderedTasks.set(subtask.id, element);
    fragment.appendChild(element);
  });

  // Rebuild the toolbar relationships.
  allTasks.forEach((task) => {
    const element = renderedTasks.get(task.id);
    const parentElement =
      renderedTasks.get(task.parentTaskId) ||
      document.querySelector(
        `[${ATTR.TASK_ITEM}][data-id="${task.parentTaskId}"]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
      );

    if (parentElement && element) {
      renderSubtaskInItsParentToolbar(parentElement, element, operationType);
    }

    addSubtaskToggler(element, lists.default.getAllDescendants(task.id));
  });

  return fragment;
};

export const putSubtaskAtTheEnd = (taskObject, targetContainer) => {
  const parentId = taskObject.parentTaskId;

  const OPERATION_TYPE = "completion";

  const fragment = updateDOM(taskObject, OPERATION_TYPE);

  if (!parentId) {
    targetContainer.appendChild(fragment);
    return;
  }

  const anchor = getSubtaskInsertionAnchor(taskObject, targetContainer);

  if (anchor) {
    targetContainer.insertBefore(fragment, anchor.nextSibling);
  } else targetContainer.appendChild(fragment);
};
