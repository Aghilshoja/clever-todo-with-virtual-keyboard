import {
  ACTIONS,
  ACTIVE,
  ATTR_STATES,
  CHECK_STATES,
  CLOSED,
  INACTIVE,
  OPEN,
} from "../constants/todo-constants.js";
import { elements, lists } from "../todos-controller.js/todos-controller.js";

const closeOpenOverlays = () => {
  const menu = document.querySelector(
    `[${CHECK_STATES.TOOLBAR_MENU}='${OPEN.TASK_MENU}']`,
  );
  if (menu) menu.dataset[ATTR_STATES.TASK_MENU] = CLOSED.TASK_MENU;

  const toolbar = document.querySelector(
    `[${CHECK_STATES.TASK_TOOLBAR}='${OPEN.TASK_TOOLBAR}']`,
  );
  const overlay = document.querySelector(
    `[${CHECK_STATES.TOOLBAR_OVERLAY_STATE}='${ACTIVE.TOOLBAR_OVERLAY}']`,
  );

  if (toolbar) toolbar.dataset[ATTR_STATES.TASK_TOOLBAR] = CLOSED.TASK_TOOLBAR;
  if (overlay)
    overlay.dataset[ATTR_STATES.TOOLBAR_OVERLAY] = INACTIVE.TOOLBAR_OVERLAY;
};

const toggleActivityLogDropMenu = (e) => {
  const activityLogDropMenu = elements.historyDropList;
  if (e.target.closest(`[${ACTIONS.ACTIVITY_LOG}]`)) {
    closeOpenOverlays();
    activityLogDropMenu.dataset[ATTR_STATES.HISTROY_DROP_LIST] =
      OPEN.HISTROY_DROP_LIST;
  } else if (
    activityLogDropMenu.dataset[ATTR_STATES.HISTROY_DROP_LIST] ===
    OPEN.HISTROY_DROP_LIST
  ) {
    activityLogDropMenu.dataset[ATTR_STATES.HISTROY_DROP_LIST] =
      CLOSED.HISTROY_DROP_LIST;
  }
};

const TIME_FIELD = {
  added: "createdAt",
  completed: "completedAt",
  deleted: "deletedAt",
  edited: "editedAt",
};

const prepareRenderingTaskHistory = (info) => {
  const taskList = lists.default.taskHistory[info.listKey];
  if (taskList.length === 0 && elements.historyContainer) {
    elements.historyContainer.innerHTML = `<li class="task-history-empty">${info.message}</li>`;
    showHistorySection();
    return;
  }

  elements.historyContainer.textContent = "";
  for (const task of taskList) {
    const time = task[TIME_FIELD[info.action]];
    const taskItem = buildHTMLTemplate(info.action, task, time);
    elements.historyContainer.prepend(taskItem);
  }
  showHistorySection();
};

const formatDateTime = (timestamp) =>
  new Date(timestamp).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const buildHTMLTemplate = (action, task) => {
  const time =
    task.editedAt ?? task.deletedAt ?? task.completedAt ?? task.createdAt;
  const description = task.description || "no description";
  const showStatus = action !== "added" && action !== "completed";
  const originalText = task.originalTaskText || "";
  const originalDescription = task.originalTaskDescription || "";

  const taskItem = `<li class="task-history" data-action="${action}">
  <p class="task-history__headline">
    <span class="task-history__action">${action}:</span>
    <span class="task-history__text">"${task.text}"</span>
  </p>
  ${originalText ? `<p class="task-history__original">original task: "${originalText}"</p>` : ""}
  <p class="task-history__description">Description: ${description}</p>
  ${originalDescription ? `<p class="task-history__original">original description "${originalDescription}"</p>` : ""}
  ${showStatus ? `<p class="task-history__status">completion status: ${task.isCompleted ? "completed" : "not completed"}</p>` : ""}
  <p class="task-history__time">${action} at: ${formatDateTime(time)}</p>
</li>`;

  const template = document.createElement("div");
  template.innerHTML = taskItem;
  return template.firstElementChild;
};

const showHistorySection = () => {
  if (elements.historySection) {
    elements.historySection.dataset[ATTR_STATES.HISTORY_SECTION] =
      OPEN.HISTORY_SECTION;
  }
};

const renderDeletedTaskHistory = (e) => {
  if (!e.target.closest(`[${ACTIONS.DELETED_TASK_HISTORY}]`)) return;
  prepareRenderingTaskHistory({
    listKey: "deletedTasks",
    message: "No deleted tasks yet",
    action: "deleted",
  });
};

const renderEditedTaskHistory = (e) => {
  if (!e.target.closest(`[${ACTIONS.EDITED_TASK_HISTORY}]`)) return;
  prepareRenderingTaskHistory({
    listKey: "editedTasks",
    message: "No edited tasks yet",
    action: "edited",
  });
};

const renderCompletedTaskHistory = (e) => {
  if (!e.target.closest(`[${ACTIONS.COMPLETED_TASK_HISTORY}]`)) return;
  prepareRenderingTaskHistory({
    listKey: "completedTasks",
    message: "No completed tasks yet",
    action: "completed",
  });
};

const renderAddedTaskHistory = (e) => {
  if (!e.target.closest(`[${ACTIONS.ADDED_TASK_HISTORY}]`)) return;
  prepareRenderingTaskHistory({
    listKey: "addedTasks",
    message: "No added tasks yet",
    action: "added",
  });
};

const exitTaskHistory = (e) => {
  if (!e.target.closest(`[${ACTIONS.TO_MAIN_PAGE}]`)) return;
  elements.historySection.dataset[ATTR_STATES.HISTORY_SECTION] =
    CLOSED.HISTORY_SECTION;
};

const renderTaskHistory = (e) => {
  renderAddedTaskHistory(e);
  renderDeletedTaskHistory(e);
  renderEditedTaskHistory(e);
  renderCompletedTaskHistory(e);
};

export { toggleActivityLogDropMenu, renderTaskHistory, exitTaskHistory };
