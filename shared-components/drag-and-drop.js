import { lists } from "../todos-controller.js/todos-controller.js";

let currentDragImage = null;

const mockTaskImage = (task) => {
  const draggedImageWrapper = document.createElement("div");
  draggedImageWrapper.classList.add("dragged-image-wrapper");
  draggedImageWrapper.style.width = `${task.offsetWidth}px`;
  const taskWrapper = document.createElement("div");
  taskWrapper.classList.add("task-wrapper");
  draggedImageWrapper.appendChild(taskWrapper);
  const taskTextEl = document.createElement("p");
  const taskDescriptionEl = document.createElement("p");
  const taskText = task.querySelector(".task__text").textContent;
  const taskDescriptionText =
    task.querySelector(".task__description").textContent;
  taskTextEl.textContent = taskText ? taskText : "";
  taskDescriptionEl.textContent = taskDescriptionText
    ? taskDescriptionText
    : "";
  taskWrapper.appendChild(taskTextEl);
  taskWrapper.appendChild(taskDescriptionEl);
  return draggedImageWrapper;
};

export const dragStart = (e) => {
  const task = e.target.closest(".task");
  if (!task) return;

  e.dataTransfer.setData("text/plain", task.dataset.id);

  currentDragImage = document.createElement("div");

  const draggedImage = mockTaskImage(task);

  if (e.currentTarget.classList.contains("list")) {
    const checkBox = task.querySelector(".task__main-task-checkbox");
    if (!checkBox) return;
    const clonedCheckbox = checkBox.cloneNode(false);
    draggedImage.prepend(clonedCheckbox);
    currentDragImage.appendChild(draggedImage);
  } else if (e.currentTarget.classList.contains("completed-list")) {
    const checkbox = task.querySelector(".task__completed-main-task-checkbox");
    if (!checkbox) return;
    const clonedCheckBox = checkbox.cloneNode(false);
    draggedImage.prepend(clonedCheckBox);
    currentDragImage.appendChild(draggedImage);
  }

  document.body.appendChild(currentDragImage);

  e.dataTransfer.setDragImage(currentDragImage, 20, 10);

  setTimeout(() => {
    task.classList.add("task--dragging");
  }, 0);
};

export const dragOver = (e) => {
  e.preventDefault();
};

export const draggedEnter = (e) => {
  const dragedEnter = e.target.closest(".task");
  if (!dragedEnter) return;
  dragedEnter.classList.add("task--highlight");
};

export const draggedLeave = (e) => {
  const closestTaskItem = e.target.closest(".task");
  if (!closestTaskItem) return;
  closestTaskItem.classList.remove("task--highlight");
};

export const draggedEndTask = (e) => {
  document
    .querySelectorAll(".task--highlight, .task--dragging")
    .forEach((taskItem) =>
      taskItem.classList.remove("task--highlight", "task--dragging"),
    );

  if (currentDragImage) {
    currentDragImage.remove();
    currentDragImage = null;
  }
};

export const dropTarget = (e) => {
  const taskId = e.dataTransfer.getData("text");
  if (!taskId) return;

  const draggedTask = document.querySelector(`.task[data-id="${taskId}"]`);

  const dropT = e.target.closest(".task");
  const tasksContainer = e.currentTarget;
  if (!dropT || !draggedTask) return;

  dropT.classList.remove("task--highlight");
  draggedTask.classList.remove("task--dragging");

  const sourceContainer = draggedTask.closest(".list, .completed-list");
  if (!sourceContainer || sourceContainer !== tasksContainer) return;

  const activeList = e.currentTarget.classList.contains("list");
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
