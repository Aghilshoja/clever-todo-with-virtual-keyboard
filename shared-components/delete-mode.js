import { getCachedElements } from "./get-cached-element.js";
import { appStateUi } from "../todos-controller.js/todos-controller.js";
import { lists } from "../todos-controller.js/todos-controller.js";
import { activeUlId } from "./render-tasks.js";
import { countTasks } from "./count-tasks.js";

const elements = getCachedElements();

const handleEmptyTaskStateUi = () => {
  const listContainer = document.querySelector(`
      .list[data-id="${activeUlId.ul}"]`);
  if (lists.default.tasks.length === 0) {
    listContainer.innerHTML = `
              <img
              src="photo_2026-02-20_12-00-02.jpg"
              alt="Your inbox is empty"
              class="main-page__empty-state-image"
              width="250"
            />
            <p class="main-page__empty-state-description">
              <strong>Capture now,</strong><strong> Plan later</strong
              ><br />Inbox is your go-to spot for quick task entry.
            </p>
            <p class="main-page__empty-state-description">
              Clear your mind now, organize when you're ready
            </p>
    `;
  }
};

export const deleteTask = (e) => {
  if (!elements) throw new Error("Required elemetn was not found");
  if (e.target.closest(".warning__confirm-deletion")) {
    const taskItem = document.querySelector(
      `.task[data-id="${appStateUi.taskId}"]`,
    );
    if (taskItem) taskItem.remove();
    lists.default.deleteTask(appStateUi.taskId);
    if (elements.warningPopup)
      elements.warningPopup.classList.remove("warning--active");
  } else elements.warningPopup.classList.remove("warning--active");

  handleEmptyTaskStateUi();
  countTasks();
};

export const warnDeletion = (e) => {
  if (e.target.closest(".task__delete")) {
    if (!elements) throw new Error("Required elemetn was not found");
    const taskItem = e.target.closest(".task");
    appStateUi.taskId = taskItem.dataset.id;
    if (elements.warningPopup)
      elements.warningPopup.classList.add("warning--active");
    const taskText = taskItem.querySelector(".task__text").textContent;
    const warningMessage = elements.warningPopup.querySelector(
      ".warning__task-name",
    );
    if (!warningMessage) return;
    warningMessage.innerHTML = `This will permanently delete "${taskText}" and can't be undone`;
  }
};
