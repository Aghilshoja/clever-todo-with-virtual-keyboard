import { getCachedElements } from "../shared-components/get-cached-element.js";
import { appStateUi } from "../todos-controller.js/todos-controller.js";

const elements = getCachedElements();

export const toggleOptions = (e) => {
  if (!elements) throw new Error("Required DOM was not found");
  if (!elements.dropDownList) return;

  if (e.target.closest(".main-page__trigger-options")) {
    const allTasks = document.querySelectorAll(".task");
    const getSelectedTaskItem = document.querySelector(
      ".main-page__select-your-tasks",
    );
    if (allTasks.length >= 1)
      getSelectedTaskItem.classList.remove("initially-hidden");
    else getSelectedTaskItem.classList.add("initially-hidden");
    elements.dropDownList.classList.toggle("main-page__drop-down-list--active");
  } else if (
    elements.dropDownList.classList.contains(
      "main-page__drop-down-list--active",
    )
  )
    elements.dropDownList.classList.remove("main-page__drop-down-list--active");
};

const fadeNavAndTaskHeader = () => {
  const navigationChildren = Array.from(elements.navigation.children);
  navigationChildren.forEach((el) => el.classList.add("nav-opacity"));
  const children = Array.from(elements.mainPageFlexContainer.children);
  children.forEach((el) => el.classList.add("header-opacity"));
};

export const triggerTaskSelectionUi = (e) => {
  if (!elements) throw new Error("required DOM was not found");
  if (e.target.closest(".main-page__select-your-tasks")) {
    fadeNavAndTaskHeader();
    if (!elements.selectedTasks || !elements.mainPageToolbar) return;
    elements.selectedTasks.classList.add(
      "main-page__count-selected-tasks--active",
    );
    elements.mainPageToolbar.classList.add("main-page__toolbar--active");
    const lastChild = elements.selectedTasks.lastElementChild;
    lastChild.textContent = "0 selected tasks";

    if (elements.mainPageNewTaskCon)
      elements.mainPageNewTaskCon.classList.add("hide-adding-task-icon");
  }
};

export const updateLabelsOfOperationalButtonsForSelectedTasks = () => {
  const counter = appStateUi.selectedTasksCounter;
  const isCompletedList = appStateUi.taskSelectionMode === "on-completed-list";
  const selectedTasksElement = elements.selectedTasks;

  if (!selectedTasksElement) return;

  const numberOfSelectedTasksDisplay = selectedTasksElement.lastElementChild;
  numberOfSelectedTasksDisplay.textContent =
    counter === 1 ? "1 selected task" : `${counter} selected tasks`;

  const operationConfig = {
    ".main-page__delete-label": (count) =>
      `Delete ${count} task${count !== 1 ? "s" : ""}`,
    ".main-page__duplication-label": (count) =>
      `Duplicate ${count} task${count !== 1 ? "s" : ""}`,
    ".main-page__completed-or-uncompleted-label": (count) => {
      const action = isCompletedList ? "Uncomplete" : "Complete";
      return `${action} ${count} task${count !== 1 ? "s" : ""}`;
    },
  };

  for (const selector in operationConfig) {
    const el = document.querySelector(selector);

    if (el) el.innerHTML = operationConfig[selector](counter);
  }
};

export const disableOrEnableButtons = () => {
  const allSelectedTasks = document.querySelectorAll(
    ".highlight-selected-tasks",
  );
  if (!elements.activateToolbarButtons) return;
  elements.activateToolbarButtons.forEach((el) => {
    if (allSelectedTasks.length > 0) {
      el.disabled = false;
      el.classList.remove("deactivate");
    } else {
      el.disabled = true;
      el.classList.add("deactivate");
    }
  });
};

const fadeHighlightedTasksOfCompletedList = (parentOfTarget) => {
  const getCompletedlistParent = parentOfTarget.nextElementSibling;
  if (!getCompletedlistParent) return;
  const completedlist = getCompletedlistParent.querySelector("ul");
  if (!completedlist) return;
  const removeHighlightedTaskOfCompletedList = completedlist.querySelectorAll(
    ".highlight-selected-tasks",
  );
  removeHighlightedTaskOfCompletedList.forEach((el) =>
    el.classList.remove("highlight-selected-tasks"),
  );
};

const fadeHighlightedTasksOfActiveList = (parentOfTarget) => {
  const activeList = parentOfTarget.closest("section").previousElementSibling;
  if (!activeList) return;
  const highlightedTasksOfActiveList = activeList.querySelectorAll(
    ".highlight-selected-tasks",
  );
  highlightedTasksOfActiveList.forEach((task) =>
    task.classList.remove("highlight-selected-tasks"),
  );
};

const unfadeNavAndTaskHeader = () => {
  if (!elements) throw new Error("Required DOM was not found");
  if (!elements.mainPageFlexContainer) return;
  const mainPageFlexCon = Array.from(elements.mainPageFlexContainer.children);
  mainPageFlexCon.forEach((el) => el.classList.remove("header-opacity"));
  const navChildren = Array.from(elements.navigation.children);
  navChildren.forEach((el) => el.classList.remove("nav-opacity"));
};

export const updateCounterAfterCompletingOrUncompletingATask = () => {
  const selectedTasks = document.querySelectorAll(".highlight-selected-tasks");
  appStateUi.selectedTasksCounter = selectedTasks.length;
};

export const selectTasks = (e) => {
  if (!elements) throw new Error("Required DOM was not found");
  if (!elements.selectedTasks) return;
  /*
   * If the task-selection counter is not active, then clicking a task should go through the normal toolbar flow, so this selection handler must exit early and avoid highlighting the task.
   */
  const isSelectedTaskActive = elements.selectedTasks.classList.contains(
    "main-page__count-selected-tasks--active",
  );
  if (!isSelectedTaskActive) return;
  const selectedTask = e.target.closest(".task");
  if (!selectedTask) return;
  selectedTask.classList.toggle("highlight-selected-tasks");
  const isTheTaskHighlited = selectedTask.classList.contains(
    "highlight-selected-tasks",
  );
  const parentOfTarget = selectedTask.closest(".list, .completed-list");
  if (!parentOfTarget) return;
  if (
    parentOfTarget.classList.contains("list") &&
    !e.target.closest(".task__main-task-checkbox")
  ) {
    if (appStateUi.taskSelectionMode === "on-completed-list") {
      appStateUi.selectedTasksCounter = 0;
      fadeHighlightedTasksOfCompletedList(parentOfTarget);
    }

    appStateUi.taskSelectionMode = "on-active-list";
    if (isTheTaskHighlited) appStateUi.selectedTasksCounter++;
    else appStateUi.selectedTasksCounter--;
  } else if (
    parentOfTarget.classList.contains("completed-list") &&
    !e.target.closest(".task__completed-main-task-checkbox")
  ) {
    /* 
     when users switche betwwen lists reset counter and show number of selected tasks of the current focused list
    */
    if (appStateUi.taskSelectionMode === "on-active-list") {
      fadeHighlightedTasksOfActiveList(parentOfTarget);
      appStateUi.selectedTasksCounter = 0;
    }

    appStateUi.taskSelectionMode = "on-completed-list";
    if (isTheTaskHighlited) appStateUi.selectedTasksCounter++;
    else appStateUi.selectedTasksCounter--;
  }

  disableOrEnableButtons();

  updateLabelsOfOperationalButtonsForSelectedTasks();
};

export const toggleOptionsOfSelectedTasks = (e) => {
  if (!elements) throw new Error("Required DOM was not found");
  if (!elements.mainPageSelectedTaskToolbarmanu) return;
  if (e.target.closest(".main-page__more--options"))
    elements.mainPageSelectedTaskToolbarmanu.classList.add(
      "main-page__toolbar-manu--active",
    );
  else
    elements.mainPageSelectedTaskToolbarmanu.classList.remove(
      "main-page__toolbar-manu--active",
    );
  updateLabelsOfOperationalButtonsForSelectedTasks();
};

export const exitTaskSelection = (e) => {
  if (!elements) throw new Error("Required DOM was not found");
  if (!e.target.closest(".main-page__exit-task-selection")) return;
  unfadeNavAndTaskHeader();
  elements.selectedTasks.classList.remove(
    "main-page__count-selected-tasks--active",
  );
  elements.mainPageToolbar.classList.remove("main-page__toolbar--active");
  elements.mainPageNewTaskCon.classList.remove("hide-adding-task-icon");

  const allSelectedTasks = document.querySelectorAll(
    ".highlight-selected-tasks",
  );
  allSelectedTasks.forEach((el) =>
    el.classList.remove("highlight-selected-tasks"),
  );
  appStateUi.selectedTasksCounter = 0;
  updateLabelsOfOperationalButtonsForSelectedTasks();
  disableOrEnableButtons();
  const isManuOpen =
    elements.mainPageSelectedTaskToolbarmanu.classList.contains(
      "main-page__toolbar-manu--active",
    );
  if (isManuOpen)
    elements.mainPageSelectedTaskToolbarmanu.classList.remove(
      "main-page__toolbar-manu--active",
    );
};
