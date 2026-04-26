import { lists } from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { appStateUi } from "../../todos-controller.js/todos-controller.js";

const elements = getCachedElements();

const checkWhatIsClicked = (event) => {
  const editBtn = event.target.closest(".task__edit");
  if (editBtn) {
    appStateUi.activeMode = "edit-task";
    appStateUi.activePlaceholder = "Edit-your-task";
  }
  const descriptionBtn = event.target.closest(".task__toolbar-description");
  if (descriptionBtn) {
    appStateUi.activeMode = "edit-description";
    appStateUi.activePlaceholder = "Description";
  }

  const result = editBtn || descriptionBtn;
  return result;
};

const findTaskToEdit = (taskId) => {
  const foundTask = lists.default.editTaskOrDescription(taskId);
  appStateUi.taskObjectToEdit = foundTask;
  return foundTask;
};

const getTaskItem = (event) => {
  const taskItem = event.target.closest(".task");
  const toolbar = taskItem.querySelector(".task__toolbar-actions");
  if (!toolbar) return;
  return {
    toolbar,
    taskItem,
  };
};

const hideUnrelatedElements = (toolbar) => {
  if (!toolbar) return;
  if (elements.unrelatedKeyboardOptions)
    elements.unrelatedKeyboardOptions.forEach((fade) =>
      fade.classList.add("hide-unrelated-els"),
    );
  const hideUnrelatedElements = toolbar.querySelectorAll(
    ".task__other-actions-list, .task__inbox, .task__toolbar-subtask, .task__date, .task__toolbar-comment",
  );

  if (hideUnrelatedElements)
    hideUnrelatedElements.forEach((fade) =>
      fade.classList.add("hide-unrelated-els"),
    );
};

const activiateToolbar = (toolbar) => {
  if (!toolbar) return;
  toolbar.classList.add("toolbar--active");

  const editPageUi = toolbar.querySelector(".task__edit-page");
  if (editPageUi) editPageUi.classList.add("task__edit-page--active");

  const description = toolbar.querySelector(".task__toolbar-description-text");
  if (description.textContent.trim() === "")
    description.textContent = "Description";
  // get save button and task text el to enable or disable if desired input was not provided for JS logic
  const activeSaveBtn = toolbar.querySelector(".task__save-edited-task");
  if (activeSaveBtn)
    activeSaveBtn.classList.add("task__save-edited-task--active");
  const taskTextEl = toolbar.querySelector(".task__toolbar-task-text");
  if (taskTextEl) taskTextEl.classList.add("task__toolbar-task-text--active");

  const descriptionEl = toolbar.querySelector(
    ".task__toolbar-description-text",
  );
  if (descriptionEl) {
    descriptionEl.classList.add("pd");
    descriptionEl.classList.add("task__toolbar-description-text--active");
  }
};

const moveInputAndHideTaskText = (toolbar, task) => {
  const taskEl = toolbar.querySelector(".task__toolbar-task-text");
  if (!taskEl) return;

  if (elements.inputElement)
    elements.inputElement.classList.remove(
      "keyboard-section__task-input--caret",
    );
  elements.inputElement.textContent = "";
  taskEl.classList.add("hide-task-text");
  taskEl.after(elements.inputElement);
  const caret = ensureCaret(elements.inputElement);
  caret.insertAdjacentText("beforebegin", task.text);
};

const moveInputAndHideTaskDescription = (toolbar, task) => {
  if (!toolbar) return;
  const descriptionEl = toolbar.querySelector(
    ".task__toolbar-description-text",
  );
  if (!descriptionEl) return;
  descriptionEl.classList.add("hide-task-description");
  descriptionEl.after(elements.inputElement);
  if (task.description === null) {
    elements.inputElement.classList.add("keyboard-section__task-input--caret");
    elements.inputElement.textContent = "Description";
  } else if (task.description !== null) {
    if (elements.inputElement)
      elements.inputElement.classList.remove(
        "keyboard-section__task-input--caret",
      );
    elements.inputElement.textContent = "";
    const caret = ensureCaret(elements.inputElement);
    caret.insertAdjacentText("beforebegin", task.description);
  }
};

export const detectClickedElementAndGetTaskObject = (event) => {
  const eventTarget = checkWhatIsClicked(event);
  if (!eventTarget) return;
  const taskObject = findTaskToEdit(eventTarget.dataset.id);
  const taskItem = getTaskItem(event);
  return {
    eventTarget,
    taskObject,
    taskItem,
  };
};

export const enterEditMode = (toolbar, taskObject) => {
  hideUnrelatedElements(toolbar);
  moveInputAndHideTaskText(toolbar, taskObject);
  activiateToolbar(toolbar);
};

export const enterDescriptionMode = (toolbar, taskObject) => {
  hideUnrelatedElements(toolbar);
  moveInputAndHideTaskDescription(toolbar, taskObject);
  activiateToolbar(toolbar);
};
