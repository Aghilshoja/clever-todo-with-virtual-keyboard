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
import { elements } from "../todos-controller/todos-controller.js";
import { getList } from "./complete-mode.js";
import { appStateUi } from "./todo-states/states.js";

export const toggleBatchOptions = (e) => {
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

export const toggleSelectionBarMenu = (e) => {
  const selectionBarMenu = elements.selectionBarMenu;

  const isSelectionMenuOpen =
    selectionBarMenu.dataset[ATTR_STATES.SELECTION_BAR_MENU_STATE] ===
    OPEN.SELECTION_BAR_MENU;

  if (e.target.closest(`[${ACTIONS.SELECTION_MENU_TOGGLER}]`)) {
    selectionBarMenu.dataset[ATTR_STATES.SELECTION_BAR_MENU_STATE] =
      OPEN.SELECTION_BAR_MENU;
  } else if (isSelectionMenuOpen) {
    selectionBarMenu.dataset[ATTR_STATES.SELECTION_BAR_MENU_STATE] =
      CLOSED.SELECTION_BAR_MENU;
  }
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
  if (e.target.closest(`[${ACTIONS.SELECT_TASK_ITEM}]`)) {
    fadeNavAndTaskHeader();

    elements.selectionBar.dataset[ATTR_STATES.SELECTION_BAR] =
      ACTIVE.SELECTION_BAR;
    elements.batchToolbar.dataset[ATTR_STATES.BATCH_TOOLBAR] =
      OPEN.BATCH_TOOLBAR;

    elements.selectedTasksCount.textContent = "0 selected tasks";

    elements.mainPageNewTaskCon.dataset[ATTR_STATES.TASK_CREATOR_STATE] =
      HIDDEN.TASK_CREATOR;
  }
};

export const updateLabelsOfOperationalButtonsForSelectedTasks = () => {
  const counter = appStateUi.selectedTasksCounter;

  const completedTask = document.querySelector(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}`,
  );

  const isCompletedTask =
    completedTask?.getAttribute("data-is-completed") === "true";

  elements.selectedTasksCount.textContent =
    counter === 1 ? "1 selected task" : `${counter} selected tasks`;

  const operationConfig = {
    [`[${ATTR.BATCH_DELETE_LABEL}]`]: (count) =>
      `Delete ${count} task${count !== 1 ? "s" : ""}`,
    [`[${ATTR.BATCH_DUPLICATE_LABEL}]`]: (count) =>
      `Duplicate ${count} task${count !== 1 ? "s" : ""}`,
    [`[${ATTR.BATCH_COMPLETE_LABEL}]`]: (count) => {
      const label = isCompletedTask ? "Uncomplete" : "Complete";
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

  elements.activateToolbarButtons.forEach((el) => {
    if (allSelectedTasks.length > 0) el.disabled = false;
    else el.disabled = true;
  });
};

const fadeHighlightedTasksOfSectionList = () => {
  const tasksContainer = elements.sectionListContainer;
  const removeHighlightedTaskOfCompletedList = tasksContainer.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  removeHighlightedTaskOfCompletedList.forEach(
    (el) => delete el.dataset[ATTR_STATES.HIGHLIGHT_SELECTED_TASK],
  );
};

const fadeHighlightedTasksOfActiveList = () => {
  const activeList = getList();
  if (!activeList) return;
  const highlightedTasksOfActiveList = activeList.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  highlightedTasksOfActiveList.forEach((el) => {
    delete el.dataset[ATTR_STATES.HIGHLIGHT_SELECTED_TASK];
  });
};

const unfadeNavAndTaskHeader = () => {
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

const showOrHideEllipsis = () => {
  const selectedTasks = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );

  const ellipsisBtn = elements.toggleSelectionMenu;

  if (selectedTasks.length === 1) {
    ellipsisBtn.dataset[ATTR_STATES.SELECTION_ELLIPSIS_VISIBILITY] =
      VISIBLE.SELECTION_ELLIPSIS;
  } else {
    ellipsisBtn.dataset[ATTR_STATES.SELECTION_ELLIPSIS_VISIBILITY] =
      HIDDEN.SELECTION_ELLIPSIS;
  }
};

const SELECTED_ATTR = ATTR_STATES.HIGHLIGHT_SELECTED_TASK;

const unselectActiveSelectedTasks = () => {
  const activeTasks = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}'][data-is-completed='false']`,
  );

  activeTasks.forEach((el) => delete el.dataset[SELECTED_ATTR]);
};

const unselectCompletedTasks = () => {
  const completedTasks = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}'][data-is-completed='true']`,
  );

  completedTasks.forEach((el) => delete el.dataset[SELECTED_ATTR]);
};

const updateSelectedTasksCounter = () => {
  const selected = document.querySelectorAll(
    `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
  );
  appStateUi.selectedTasksCounter = selected.length;
};

export const selectTasks = (e) => {
  // Exit early if selection mode is not active
  const isSelectionModeActive =
    elements.selectionBar.dataset[ATTR_STATES.SELECTION_BAR] ===
    ACTIVE.SELECTION_BAR;
  if (!isSelectionModeActive) return;

  const selectedTask = e.target.closest(`[${ATTR.TASK_ITEM}]`);
  if (!selectedTask) return;

  const wasSelected =
    selectedTask.dataset[SELECTED_ATTR] === HIGHLIGHT_SELECTED_TASK.SELECTED;
  const willBeSelected = !wasSelected;

  const isCompletedTask = selectedTask.dataset.isCompleted === "true";

  const parentOfTarget = selectedTask.closest(
    `[${ATTR.DEFAULT_LIST}], [${ATTR.SECTION_LIST}]`,
  );

  if (!parentOfTarget) return;

  const isDefaultList = parentOfTarget.hasAttribute(ATTR.DEFAULT_LIST);
  const isSectionList = parentOfTarget.hasAttribute(ATTR.SECTION_LIST);

  if (isDefaultList) {
    if (appStateUi.taskSelectionMode === SELECTION_BAR.SECTIONS) {
      fadeHighlightedTasksOfSectionList();
    }
    appStateUi.taskSelectionMode = SELECTION_BAR.ACTIVE_LIST;
    appStateUi.sectionId = null;
  } else if (isSectionList) {
    if (appStateUi.taskSelectionMode === SELECTION_BAR.ACTIVE_LIST) {
      fadeHighlightedTasksOfActiveList();
    }

    if (
      appStateUi.sectionId &&
      appStateUi.sectionId !== selectedTask.dataset.sectionId
    ) {
      const sectionList = document.querySelector(
        `[${ATTR.SECTION_LIST}][data-id="${appStateUi.sectionId}"]`,
      );

      if (sectionList) {
        const previousSelectedTasks = sectionList.querySelectorAll(
          `[${CHECK_STATES.SELECTED_TASK}='${HIGHLIGHT_SELECTED_TASK.SELECTED}']`,
        );
        previousSelectedTasks.forEach((el) => delete el.dataset[SELECTED_ATTR]);
      }
    }

    appStateUi.sectionId = selectedTask.dataset.sectionId;
    appStateUi.taskSelectionMode = SELECTION_BAR.SECTIONS;
  }

  if (willBeSelected) {
    if (isCompletedTask) {
      unselectActiveSelectedTasks();
    } else {
      unselectCompletedTasks();
    }
  }

  selectedTask.dataset[SELECTED_ATTR] = willBeSelected
    ? HIGHLIGHT_SELECTED_TASK.SELECTED
    : HIGHLIGHT_SELECTED_TASK.UNSELECTED;

  updateSelectedTasksCounter();

  disableOrEnableButtons();
  updateLabelsOfOperationalButtonsForSelectedTasks();
  showOrHideEllipsis();
};

export const toggleOptionsOfSelectedTasks = (e) => {
  if (e.target.closest(`[${ACTIONS.TOGGLE_BATCH_MENU}]`))
    elements.mainPageBatchMenu.dataset[ATTR_STATES.BATCH_MENU] =
      OPEN.BATCH_MENU;
  else
    elements.mainPageBatchMenu.dataset[ATTR_STATES.BATCH_MENU] =
      CLOSED.BATCH_MENU;
  updateLabelsOfOperationalButtonsForSelectedTasks();
};

export const exitTaskSelection = () => {
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

export const handleExitSelectionClick = (e) => {
  if (!e.target.closest(`[${ACTIONS.EXIT_TASK_SELECTION}]`)) return;
  exitTaskSelection();
};
