import { lists } from "../todos-controller.js/todos-controller.js";
import {
  ACTIONS,
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  OPEN,
} from "../constants/todo-constants.js";

let currentDragImage = null;

const exitDragAndDropIfToolbarActive = () => {
  const activeToolbar = document.querySelector(
    `[${CHECK_STATES.TASK_TOOLBAR}='${OPEN.TASK_TOOLBAR}']`,
  );

  return activeToolbar || null;
};

const clearDragState = () => {
  document
    .querySelectorAll(
      `[${ATTR.DRAGGING_TASK}], [${ATTR.DROP_TARGET_HIGHLIGHT}]`,
    )
    .forEach((taskItem) => {
      delete taskItem.dataset[ATTR_STATES.DRAGGING_TASK];
      delete taskItem.dataset[ATTR_STATES.DROP_TARGET_HIGHLIGHT];
    });
};

const mockTaskImage = (task) => {
  const draggedImageWrapper = document.createElement("div");
  draggedImageWrapper.classList.add("dragged-image-wrapper");
  draggedImageWrapper.style.width = `${task.offsetWidth}px`;
  const taskWrapper = document.createElement("div");
  taskWrapper.classList.add("task-wrapper");
  draggedImageWrapper.appendChild(taskWrapper);
  const taskTextEl = document.createElement("p");
  const taskDescriptionEl = document.createElement("p");
  const taskText = task.querySelector(`[${ATTR.MAIN_TASK_TEXT}]`).textContent;
  const taskDescriptionText = task.querySelector(
    `[${ATTR.MAIN_TASK_DESCRIPTION}]`,
  ).textContent;
  taskTextEl.textContent = taskText ? taskText : "";
  taskDescriptionEl.textContent = taskDescriptionText
    ? taskDescriptionText
    : "";
  taskWrapper.appendChild(taskTextEl);
  taskWrapper.appendChild(taskDescriptionEl);
  return draggedImageWrapper;
};

export const dragStart = (e) => {
  const task = e.target.closest(`[${ATTR.TASK_ITEM}]`);
  if (!task) return;

  const activeToolbar = exitDragAndDropIfToolbarActive();
  if (activeToolbar) {
    e.preventDefault();
    return;
  }

  e.dataTransfer.setData("text/plain", task.dataset.id);

  currentDragImage = document.createElement("div");

  const draggedImage = mockTaskImage(task);

  if (e.currentTarget.hasAttribute(ATTR.DEFAULT_LIST)) {
    const checkBox = task.querySelector(`[${ACTIONS.COMPLETE_TASK}]`);
    if (!checkBox) return;
    const clonedCheckbox = checkBox.cloneNode(false);
    draggedImage.prepend(clonedCheckbox);
    currentDragImage.appendChild(draggedImage);
  } else if (e.currentTarget.hasAttribute(ATTR.COMPLETED_LIST)) {
    const checkbox = task.querySelector(`[${ACTIONS.UNCOMPLETE_TASK}]`);
    if (!checkbox) return;
    const clonedCheckBox = checkbox.cloneNode(false);
    draggedImage.prepend(clonedCheckBox);
    currentDragImage.appendChild(draggedImage);
  }

  document.body.appendChild(currentDragImage);

  e.dataTransfer.setDragImage(currentDragImage, 20, 10);

  setTimeout(() => {
    task.dataset[ATTR_STATES.DRAGGING_TASK] = "";
  }, 0);
};

export const dragOver = (e) => {
  e.preventDefault();
};

export const draggedEnter = (e) => {
  const dragedEnter = e.target.closest(`[${ATTR.TASK_ITEM}]`);
  if (!dragedEnter) return;
  dragedEnter.dataset[ATTR_STATES.DROP_TARGET_HIGHLIGHT] = "";
};

export const draggedLeave = (e) => {
  const closestTaskItem = e.target.closest(`[${ATTR.TASK_ITEM}]`);
  if (!closestTaskItem) return;
  delete closestTaskItem.dataset[ATTR_STATES.DROP_TARGET_HIGHLIGHT];
};

export const draggedEndTask = (e) => {
  clearDragState();

  if (currentDragImage) {
    currentDragImage.remove();
    currentDragImage = null;
  }
};

export const dropTarget = (e) => {
  const taskId = e.dataTransfer.getData("text");
  if (!taskId) return;

  const draggedTask = document.querySelector(
    `[${ATTR.TASK_ITEM}][data-id="${taskId}"]`,
  );

  const dropT = e.target.closest(`[${ATTR.TASK_ITEM}]`);
  const tasksContainer = e.currentTarget;
  if (!dropT || !draggedTask) return;

  clearDragState();

  const sourceContainer = draggedTask.closest(
    `[${ATTR.DEFAULT_LIST}], [${ATTR.COMPLETED_LIST}]`,
  );
  if (!sourceContainer || sourceContainer !== tasksContainer) return;

  const activeList = e.currentTarget.hasAttribute(ATTR.DEFAULT_LIST);
  const currentList = activeList
    ? lists.default.getTasks()
    : lists.default.getCompletedTasks();

  const rect = dropT.getBoundingClientRect();
  const isAfter = e.clientY > rect.top + rect.height / 1.8;

  const draggedTaskIndex = currentList.findIndex((t) => t.id === taskId);
  const droppedTaskIndex = currentList.findIndex(
    (t) => t.id === dropT.dataset.id,
  );

  if (draggedTaskIndex === -1 || droppedTaskIndex === -1) return;

  const [removedTask] = currentList.splice(draggedTaskIndex, 1);
  currentList.splice(droppedTaskIndex, 0, removedTask);
  tasksContainer.insertBefore(
    draggedTask,
    isAfter ? dropT.nextElementSibling : dropT,
  );
};
