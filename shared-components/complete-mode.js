import { lists } from "../todos-controller.js/todos-controller.js";
import { getCachedElements } from "./get-cached-element.js";
import { renderCompletedTask } from "./render-tasks.js";
import { activeUlId } from "./render-tasks.js";
import { countTasks } from "./count-tasks.js";
import { addListeners } from "../todos-controller.js/todos-controller.js";
import { handleEmptyTaskStateUi } from "./delete-mode.js";

const elements = getCachedElements();

const removeCompleteTaskFromActiveList = (taskId) => {
  const taskItem = document.querySelector(`.task[data-id="${taskId}"]`);
  if (!taskItem) return;
  taskItem.remove();
};

export const getCompletedListContainer = () => {
  const activeList = document.querySelector(
    `.list[data-id="${activeUlId.ul}"]`,
  );

  const listWrapper = activeList.nextElementSibling;
  const completedListTitle = listWrapper.querySelector("summary");
  const completedList = listWrapper.querySelector("ul");
  return {
    listWrapper,
    completedListTitle,
    completedList,
  };
};

export const showNumberOfCompletedTasks = () => {
  const numberOfCompletedTasks = lists.default.getCompletedTasks().length;
  const completedElements = getCompletedListContainer();
  if (!completedElements) return;
  completedElements.completedListTitle.textContent =
    numberOfCompletedTasks === 1
      ? `${numberOfCompletedTasks} completed task`
      : `${numberOfCompletedTasks} completed tasks`;
  completedElements.listWrapper.classList.add(
    "completed-default-tasks--active",
  );

  if (numberOfCompletedTasks === 0) {
    completedElements.listWrapper.classList.remove(
      "completed-default-tasks--active",
    );
  }
};

export const completeTask = (e) => {
  const clickedCheckbox =
    e.target.closest(".task__main-task-checkbox") ||
    e.target.closest(".task__toolbar-task-checkbox");
  if (!clickedCheckbox) return;
  if (!elements) throw new Error("Required DOM was not found");
  const taskId = clickedCheckbox.dataset.id;
  if (!taskId) return;
  const completedTaskobject = lists.default.markTaskAsCompleted(taskId);
  const completedListContainer = getCompletedListContainer();
  if (!completedListContainer) return;
  removeCompleteTaskFromActiveList(taskId);
  addListeners(
    completedListContainer.completedList,
  ); /* add listeners to the completed list */
  showNumberOfCompletedTasks();
  renderCompletedTask(completedTaskobject);
  countTasks(); //update badge of active list
  handleEmptyTaskStateUi();
};
