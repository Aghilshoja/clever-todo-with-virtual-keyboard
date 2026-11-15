import {
  ACTIONS,
  ATTR,
  ATTR_STATES,
  HIDDEN,
  VISIBLE,
} from "../../constants/todo-constants.js";
import { appStateUi } from "../todo-states/states.js";

const EXPANDED = "expanded";
const COLLAPSED = "collapsed";
const EXPANSION_STATE = "subTasksExpanded";

export const getOriginalTaskElements = () => {
  appStateUi.detachedTasks = [
    ...document.querySelectorAll(
      `[${ATTR.TASK_ITEM}]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
    ),
  ].map((element) => element.cloneNode(true));

  return appStateUi.detachedTasks;
};

const getLiveDOM = () => {
  return document.querySelectorAll(
    `[${ATTR.TASK_ITEM}]:not([${ATTR.SUBTASKS_CONTAINER}] *)`,
  );
};

const syncSubtaskVisibility = () => {
  const taskElements = [...getLiveDOM()];

  // Index original task elements by ID.
  const taskElementsById = new Map(
    taskElements.map((el) => [el.dataset.id, el]),
  );
  for (const taskEl of taskElements) {
    const parentTaskId = taskEl.dataset.parentTaskId;

    if (!parentTaskId) continue;

    let ancestorId = parentTaskId;
    let shouldBeVisible = true;

    // Check the entire ancestor chain.
    while (ancestorId) {
      const ancestorEl = taskElementsById.get(ancestorId);

      if (!ancestorEl) break;

      // Initialize missing state as expanded for compatibility.
      if (!ancestorEl.dataset[EXPANSION_STATE]) {
        ancestorEl.dataset[EXPANSION_STATE] = EXPANDED;
      }

      if (ancestorEl.dataset[EXPANSION_STATE] === COLLAPSED) {
        shouldBeVisible = false;
        break;
      }

      ancestorId = ancestorEl.dataset.parentTaskId;
    }

    taskEl.dataset[ATTR_STATES.SUBTASKS] = shouldBeVisible
      ? VISIBLE.SUBTASKS
      : HIDDEN.SUBTASKS;
    0;
  }
};

export const toggleSubTasksVisibility = (e) => {
  const togglerBtn = e.target.closest(`[${ACTIONS.SUBTASK_TOGGLER}]`);

  if (!togglerBtn) return;

  const clickedTaskEl = togglerBtn.closest(`[${ATTR.TASK_ITEM}]`);

  if (!clickedTaskEl) return;

  const taskId = clickedTaskEl.dataset.id;

  // Resolve the original element rather than a toolbar clone.
  const taskEl = [...getLiveDOM()].find((el) => el.dataset.id === taskId);

  if (!taskEl) return;

  const currentState = taskEl.dataset[EXPANSION_STATE] || EXPANDED;

  const nextState = currentState === EXPANDED ? COLLAPSED : EXPANDED;

  taskEl.dataset[EXPANSION_STATE] = nextState;

  // Keep the icon consistent wherever this task is represented.
  const iconHtml =
    nextState === COLLAPSED
      ? '<i class="fas fa-chevron-right" aria-hidden="true"></i>'
      : '<i class="fas fa-chevron-down" aria-hidden="true"></i>';

  document.querySelectorAll(`[${ACTIONS.SUBTASK_TOGGLER}]`).forEach((btn) => {
    if (btn.dataset.id === taskId) {
      btn.innerHTML = iconHtml;
    }
  });

  syncSubtaskVisibility();
};
