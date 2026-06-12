import {
  ACTIONS,
  ACTIVE,
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  CLOSED,
  HIDDEN,
  HIGHLIGHT_SELECTED_TASK,
  INACTIVE,
  OPEN,
  SELECTION_BAR,
  VISIBLE,
} from "../constants/todo-constants.js";
import { getCachedElements } from "../shared-components/get-cached-element.js";
import { appStateUi } from "../todos-controller.js/todos-controller.js";

const elements = getCachedElements();

export const toggleOptions = (e) => {
  if (!elements) throw new Error("Required DOM was not found");
  if (!elements.dropDownList) return;
  if (e.target.closest(`[${ACTIONS.TOGGLE_DROPDOWN_LIST}]`)) {
    const allTasks = document.querySelectorAll(`[${ATTR.TASK_ITEM}]`);
    const getSelectedTaskItem = document.querySelector(
      `[${ATTR.SELECT_TASK_ITEM}]`,
    );
    if (allTasks.length >= 1)
      getSelectedTaskItem.dataset[ATTR_STATES.SELECT_TASK_ITEM_STATE] =
        VISIBLE.SELECT_TASK_ITEM;
    else
      getSelectedTaskItem.dataset[ATTR_STATES.SELECT_TASK_ITEM_STATE] =
        HIDDEN.SELECT_TASK_ITEM;
    elements.dropDownList.dataset[ATTR_STATES.DROPDOWN_LIST] =
      OPEN.MAIN_DROPDOWN;
  } else if (
    elements.dropDownList.dataset[ATTR_STATES.DROPDOWN_LIST] ===
    OPEN.MAIN_DROPDOWN
  )
    elements.dropDownList.dataset[ATTR_STATES.DROPDOWN_LIST] =
      CLOSED.MAIN_DROPDOWN;
};

const fadeNavAndTaskHeader = () => {
  const navigationChildren = Array.from(elements.navigation.children);
  navigationChildren.forEach(
    (el) =>
      (el.dataset[ATTR_STATES.UNRELATED_ELS_TO_SELECTION] =
        HIDDEN.UNRELATED_ELS),
  );
  const children = Array.from(elements.mainPageFlexContainer.children);
  children.forEach(
    (el) =>
      (el.dataset[ATTR_STATES.UNRELATED_ELS_TO_SELECTION] =
        HIDDEN.UNRELATED_ELS),
  );
};

export const triggerTaskSelectionUi = (e) => {
  if (!elements) throw new Error("required DOM was not found");
  if (e.target.closest(`[${ACTIONS.SELECT_TASK_ITEM}]`)) {
    fadeNavAndTaskHeader();
    if (!elements.selectionBar || !elements.batchToolbar) return;
    elements.selectionBar.dataset[ATTR_STATES.SELECTION_BAR] =
      ACTIVE.SELECTION_BAR;
    elements.batchToolbar.dataset[ATTR_STATES.BATCH_TOOLBAR] =
      OPEN.BATCH_TOOLBAR;
    const lastChild = elements.selectionBar.lastElementChild;
    lastChild.textContent = "0 selected tasks";

    if (elements.mainPageNewTaskCon)
      elements.mainPageNewTaskCon.dataset[ATTR_STATES.TASK_CREATOR_STATE] =
        HIDDEN.TASK_CREATOR;
  }
};

export const updateLabelsOfOperationalButtonsForSelectedTasks = () => {
  const counter = appStateUi.selectedTasksCounter;
  const isCompletedList =
    appStateUi.taskSelectionMode === SELECTION_BAR.COMPLETED_LIST;
  const selectedTasksElement = elements.selectionBar;

  if (!selectedTasksElement) return;

  const numberOfSelectedTasksDisplay = selectedTasksElement.lastElementChild;
  numberOfSelectedTasksDisplay.textContent =
    counter === 1 ? "1 selected task" : `${counter} selected tasks`;

  const operationConfig = {
    [`[${ATTR.BATCH_DELETE_LABEL}]`]: (count) =>
      `Delete ${count} task${count !== 1 ? "s" : ""}`,
    [`[${ATTR.BATCH_DUPLICATE_LABEL}]`]: (count) =>
      `Duplicate ${count} task${count !== 1 ? "s" : ""}`,
    [`[${ATTR.BATCH_COMPLETE_LABEL}]`]: (count) => {
      const label = isCompletedList ? "Uncomplete" : "Complete";
      return `${label} ${count} task${count !== 1 ? "s" : ""}`;
    },
  };

  for (const selector in operationConfig) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = operationConfig[selector](counter);
  }
};

export const disableOrEnableButtons = () => {
  const allSelectedTasks = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  if (!elements.activateToolbarButtons) return;
  elements.activateToolbarButtons.forEach((el) => {
    if (allSelectedTasks.length > 0) el.disabled = false;
    else el.disabled = true;
  });
};

const fadeHighlightedTasksOfCompletedList = (parentOfTarget) => {
  const getCompletedlistParent = parentOfTarget.nextElementSibling;
  if (!getCompletedlistParent) return;
  const completedlist = getCompletedlistParent.querySelector("ul");
  if (!completedlist) return;
  const removeHighlightedTaskOfCompletedList = completedlist.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}]`,
  );
  removeHighlightedTaskOfCompletedList.forEach(
    (el) => delete el.dataset[ATTR_STATES.HIGHLIGHT_SELECTED_TASK],
  );
};

const fadeHighlightedTasksOfActiveList = (parentOfTarget) => {
  const activeList = parentOfTarget.closest("section").previousElementSibling;
  if (!activeList) return;
  const highlightedTasksOfActiveList = activeList.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}]`,
  );
  highlightedTasksOfActiveList.forEach(
    (task) => delete task.dataset[ATTR_STATES.HIGHLIGHT_SELECTED_TASK],
  );
};

const unfadeNavAndTaskHeader = () => {
  if (!elements) throw new Error("Required DOM was not found");
  if (!elements.mainPageFlexContainer) return;
  const mainPageFlexCon = Array.from(elements.mainPageFlexContainer.children);
  mainPageFlexCon.forEach(
    (el) => delete el.dataset[ATTR_STATES.UNRELATED_ELS_TO_SELECTION],
  );
  const navChildren = Array.from(elements.navigation.children);
  navChildren.forEach(
    (el) => delete el.dataset[ATTR_STATES.UNRELATED_ELS_TO_SELECTION],
  );
};

export const updateCounterAfterCompletingOrUncompletingATask = () => {
  const selectedTasks = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );
  appStateUi.selectedTasksCounter = selectedTasks.length;
};

export const selectTasks = (e) => {
  if (!elements) throw new Error("Required DOM was not found");
  if (!elements.selectionBar) return;
  /*
   * If the task-selection counter is not active, then clicking a task should go through the normal toolbar flow, so this selection handler must exit early and avoid highlighting the task.
   */
  const isSelectionModeActive =
    elements.selectionBar.dataset[ATTR_STATES.SELECTION_BAR] ===
    ACTIVE.SELECTION_BAR;
  if (!isSelectionModeActive) return;
  const selectedTask = e.target.closest(`[${ATTR.TASK_ITEM}]`);
  if (!selectedTask) return;
  const SELECTED_tASK = ATTR_STATES.HIGHLIGHT_SELECTED_TASK;
  const isCurrentlySelected =
    selectedTask.dataset[SELECTED_tASK] === HIGHLIGHT_SELECTED_TASK.SELECTED;
  selectedTask.dataset[SELECTED_tASK] = isCurrentlySelected
    ? HIGHLIGHT_SELECTED_TASK.UNSELECTED
    : HIGHLIGHT_SELECTED_TASK.SELECTED;
  const isSelectedTask =
    selectedTask.dataset[ATTR_STATES.HIGHLIGHT_SELECTED_TASK] ===
    HIGHLIGHT_SELECTED_TASK.SELECTED;

  const parentOfTarget = selectedTask.closest(
    `[${ATTR.DEFAULT_LIST}], [${ATTR.COMPLETED_LIST}]`,
  );
  if (!parentOfTarget) return;
  if (
    parentOfTarget.hasAttribute(`${ATTR.DEFAULT_LIST}`) &&
    !e.target.closest(`[${ACTIONS.COMPLETE_TASK}]`)
  ) {
    if (appStateUi.taskSelectionMode === SELECTION_BAR.COMPLETED_LIST) {
      appStateUi.selectedTasksCounter = 0;
      fadeHighlightedTasksOfCompletedList(parentOfTarget);
    }

    appStateUi.taskSelectionMode = SELECTION_BAR.ACTIVE_LIST;
    if (isSelectedTask) appStateUi.selectedTasksCounter++;
    else appStateUi.selectedTasksCounter--;
  } else if (
    parentOfTarget.hasAttribute(`${ATTR.COMPLETED_LIST}`) &&
    !e.target.closest(`[${ACTIONS.UNCOMPLETE_TASK}]`)
  ) {
    /* 
     when users switche betwwen lists reset counter and show number of selected tasks of the current focused list
    */
    if (appStateUi.taskSelectionMode === SELECTION_BAR.ACTIVE_LIST) {
      fadeHighlightedTasksOfActiveList(parentOfTarget);
      appStateUi.selectedTasksCounter = 0;
    }

    appStateUi.taskSelectionMode = SELECTION_BAR.COMPLETED_LIST;
    if (isSelectedTask) appStateUi.selectedTasksCounter++;
    else appStateUi.selectedTasksCounter--;
  }

  disableOrEnableButtons();

  updateLabelsOfOperationalButtonsForSelectedTasks();
};

export const toggleOptionsOfSelectedTasks = (e) => {
  if (!elements) throw new Error("Required DOM was not found");
  if (!elements.mainPageBatchMenu) return;
  if (e.target.closest(`[${ACTIONS.TOGGLE_BATCH_MENU}]`))
    elements.mainPageBatchMenu.dataset[ATTR_STATES.BATCH_MENU] =
      OPEN.BATCH_MENU;
  else
    elements.mainPageBatchMenu.dataset[ATTR_STATES.BATCH_MENU] =
      CLOSED.BATCH_MENU;
  updateLabelsOfOperationalButtonsForSelectedTasks();
};

export const exitTaskSelection = (e) => {
  if (!elements) throw new Error("Required DOM was not found");
  if (!e.target.closest(`[${ACTIONS.EXIT_TASK_SELECTION}]`)) return;
  unfadeNavAndTaskHeader();
  elements.selectionBar.dataset[ATTR_STATES.SELECTION_BAR] =
    INACTIVE.SELECTION_BAR;
  elements.batchToolbar.dataset[ATTR_STATES.BATCH_TOOLBAR] =
    CLOSED.BATCH_TOOLBAR;

  elements.mainPageNewTaskCon.dataset[ATTR_STATES.TASK_CREATOR_STATE] =
    VISIBLE.TASK_CREATOR;

  const allSelectedTasks = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}]`,
  );
  allSelectedTasks.forEach(
    (el) => delete el.dataset[ATTR_STATES.HIGHLIGHT_SELECTED_TASK],
  );
  appStateUi.selectedTasksCounter = 0;
  updateLabelsOfOperationalButtonsForSelectedTasks();
  disableOrEnableButtons();
  const isManuOpen =
    elements.mainPageBatchMenu.dataset[ATTR_STATES.BATCH_MENU] ===
    OPEN.BATCH_MENU;

  if (isManuOpen)
    elements.mainPageBatchMenu.dataset[ATTR_STATES.BATCH_MENU] =
      CLOSED.BATCH_MENU;
};
