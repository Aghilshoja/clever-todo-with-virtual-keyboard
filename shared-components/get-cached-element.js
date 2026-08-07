import { SPLSASH_HEADER_ATTR } from "../close-splash-screen/hide-splash-screen.js";
import {
  KEYBOARD_ACTIONS,
  ATTRIBUTES,
} from "../constants/keyboard-constants.js";
import {
  ATTR,
  ATTR_STATES,
  HIDDEN,
  ACTIONS,
  CHECK_STATES,
} from "../constants/todo-constants.js";

const requireElement = (selector, name) => {
  const el = document.querySelector(selector);

  if (!el) {
    throw new Error(`Missing required element: ${name}`);
  }

  return el;
};

const requireElements = (selector, name) => {
  const els = document.querySelectorAll(selector);

  if (els.length === 0) {
    throw new Error(`Missing required elements: ${name}`);
  }

  return els;
};

export const getCachedElements = () => {
  const elements = {
    splashHeader: requireElement(
      `[${SPLSASH_HEADER_ATTR.SPLASH_HEADER}]`,
      "splashHeader",
    ),
    mainPage: requireElement(`[${SPLSASH_HEADER_ATTR.MAIN_PAGE}]`, "mainPage"),
    loaderDot: requireElement(`[${SPLSASH_HEADER_ATTR.LOADING}]`, "loderDot"), // fixed a typo
    /* end of the related elements to the logo of the app */

    /* elements that are just related to the keyboard */
    keyboardSection: requireElement(
      `[${ATTRIBUTES.KEYBOARD_SECTION}]`,
      "keyboardSection",
    ),
    previewFeedback: requireElement(
      `[${ATTRIBUTES.KEY_PREVIEW}]`,
      "previewFeedback",
    ),
    keyboardDismissOverlay: requireElement(
      `[${ATTRIBUTES.KEYBOARD_OVERLAY}]`,
      "  keyboardDismissOverlay",
    ),
    keyboardContainer: requireElement(
      `[${ATTRIBUTES.KEYBOARD_CONTAINER}]`,
      "keyboardContainer",
    ),
    unrelatedKeyboardOptions: requireElements(
      `[${ATTRIBUTES.KEYBOARD_TIME_OPTIONS}], [${ATTRIBUTES.INPUT_CONTAINER}]`,
      "unrelatedKeyboardOptions",
    ),
    inputElement: requireElement(`[${ATTRIBUTES.INPUT}]`, "inputElement"),
    submitTask: requireElement(`[${KEYBOARD_ACTIONS.SUBMIT}]`, "submitTask"),
    inputCharacterLimit: requireElement(
      `[${ATTRIBUTES.CHARACTER_LIMIT_COUNT}]`,
      "inputCharacterLimit",
    ),
    circleEl: document.querySelector(`[${ATTRIBUTES.INPUT_ANCHOR}]`),
    unrelatedKeyboardOptions: document.querySelectorAll(
      `[${ATTRIBUTES.KEYBOARD_TIME_OPTIONS}], [${ATTRIBUTES.INPUT_CONTAINER}]`,
    ),
    /* end of the elements that are related to the keyboard */

    /* elements that are just related to the todo app */
    activateToolbarButtons: requireElements(
      `[${ACTIONS.BATCH_SET_DATE}], [${ACTIONS.BATCH_MOVE_TASKS}], [${ACTIONS.BATCH_ADD_LABEL}], [${ACTIONS.BATCH_SET_PRIORITY}], [${ACTIONS.BATCH_DELETE_TASKS}], [${ACTIONS.BATCH_DUPLICATE_TASKS}], [${ACTIONS.BATCH_COMPLETE_TASKS}]`,
      "    activateToolbarButtons",
    ),
    deleteHeading: requireElement(`[${ATTR.WARNING_HEADING}]`, "deleteHeading"),
    batchDeleteTasks: requireElement(
      `[${ACTIONS.BATCH_DELETE_TASKS}]`,
      "batchDeleteTasks",
    ),
    batchDuplicateTasks: requireElement(
      `[${ACTIONS.BATCH_DUPLICATE_TASKS}]`,
      "batckDuplicatedTasks",
    ),
    batchCompletedTasks: requireElement(
      `[${ACTIONS.BATCH_COMPLETE_TASKS}]`,
      "batchCompletedTasks",
    ),
    mainPageNewTask: requireElement(`[${ACTIONS.ADD_TASK}]`, "mainPageNewTask"),
    mainPageNewTaskCon: requireElement(
      `[${ATTR.TASK_CREATOR}]`,
      "mainPageNewTaskCon",
    ),
    navigation: requireElement(`[${ATTR.NAV}]`, "navigation"),
    mainPageFlexContainer: requireElement(
      `[${ATTR.HEADER_CONTAINER}]`,
      "mainPageFlexContainer",
    ),
    warningPopup: requireElement(`[${ATTR.WARNING_POPUP}]`, "warningPopup"),
    warningMessage: requireElement(
      `[${ATTR.WARNING_MESSAGE}]`,
      "warningMessage",
    ),
    taskCounter: requireElement(`[${ATTR.TASKS_COUNTER}]`, "taskCounter"),
    undoCompletion: requireElement(
      `[${ATTR.UNDO_CONTAINER}]`,
      "undoCompletion",
    ),
    undoCompletedTask: requireElement(
      `[${ACTIONS.UNDO_COMPLETION_BTN}]`,
      "undoCompletedTask",
    ),
    completionStatusLabel: requireElement(
      `[${ATTR.UNDO_STATUS}]`,
      "completionStatusLabel",
    ),
    dropDownList: requireElement(
      `[${ATTR.MAIN_DROPDOWN_LIST}]`,
      "dropDownList",
    ),
    selectionBar: requireElement(`[${ATTR.SELECTION_BAR_CON}]`, "selectionBar"),
    batchToolbar: requireElement(`[${ATTR.BATCH_TOOLBAR}]`, "batchToolbar"),
    mainPageBatchMenu: requireElement(
      `[${ATTR.BATCH_MENU}]`,
      "mainPageBatchMenu",
    ),
    selectedTasksCount: requireElement(
      `[${ATTR.SELECTED_COUNT}]`,
      "selectedTasksCount",
    ),
    toggleSelectionMenu: requireElement(
      `[${ACTIONS.SELECTION_MENU_TOGGLER}]`,
      "toggleSelectionMenu",
    ),
    selectionBarMenu: requireElement(
      `[${ATTR.SELECTION_BAR_MENU}]`,
      "selectionBarMenu",
    ),
    dateContainer: requireElement(`[${ATTR.DATE_CONTAINER}]`, "dateContainer"),
    calendarContainer: requireElement(
      `[${ATTR.CALENDAR_CONTAINER}]`,
      "calendarContainer",
    ),
    calendarHeader: requireElement(
      `[${ATTR.CALENDAR_HEADER}]`,
      "calendarHeader",
    ),
    previousMonthBtn: requireElement(
      `[${ACTIONS.TOGGLE_PREVIOUS_MONTH}]`,
      "previousMonthBtn",
    ),
    nextMonthBtn: requireElement(
      `[${ACTIONS.TOGGLE_NEXT_MONTH}]`,
      "nextMonthBtn",
    ),
    todayLabel: requireElement(`[${ATTR.TODAY_LABEL}]`, "todayLabel"),
    tomorrowLabel: requireElement(`[${ATTR.TOMORROW_LABEL}]`, "tomorrowLabel"),
    nextWeekLabel: requireElement(`[${ATTR.NEXT_WEEK_LABEL}]`, "nextWeekLabel"),
    editDueDateBtn: requireElement(
      `[${ACTIONS.EDIT_TASK_DATE}]`,
      "editDueDateBtn",
    ),
    quickOptionsContainer: requireElement(
      `[${ATTR.QUICK_OPTIONS_CONTAINER}]`,
      "quickOptioinsContainer",
    ),
    saveTaskDate: requireElement(`[${ACTIONS.SAVE_TASK_DATE}]`, "saveTaskDave"),
    saveButtonContainer: requireElement(
      `[${ATTR.SAVE_BUTTON_CONTAINER}]`,
      "saveButtonContainer",
    ),
    taskDateSuggestion: requireElement(
      `[${ATTR.DATA_SUGGESTION}]`,
      "taskDateSuggestion",
    ),
    noDateBtnContainer: requireElement(
      `[${ATTR.NO_DATE_CONTAINER}]`,
      "noDateBtnContainer",
    ),
    todayContainer: requireElement(
      `[${ATTR.TODAY_CONTANIER}]`,
      "todayContainer",
    ),
    tomorrowContainer: requireElement(
      `[${ATTR.TOMORROW_CONTAINER}]`,
      "tomorrowContainer",
    ),
    nextWeekContainer: requireElement(
      `[${ATTR.NEXT_WEEK_CONTAINER}]`,
      "nextWeekContainer",
    ),
    todayBtn: requireElement(`[${ACTIONS.SET_TODAY}]`, "todaybtn"),
    tomorrowBtn: requireElement(`[${ACTIONS.SET_TOMORROW}]`, "tomorrowBtn"),
    nextWeekBtn: requireElement(`[${ACTIONS.SET_NEXT_WEEK}]`, "nextWeekBtn"),
    noDateBtn: requireElement(`[${ACTIONS.NO_DATE_BTN}]`, "noDateBtn"),
    addTimeBtn: requireElement(`[${ACTIONS.ADD_TIME}]`, "addTimeBtn"),
    removeTimeBtn: requireElement(
      `[${ACTIONS.REMOVE_TASK_TIME}]`,
      "removeTimeBtn",
    ),
    nextWeekTimeLabel: requireElement(
      `[${ATTR.NEXT_WEEK_TIME_LABEL}]`,
      "nextWeekTimeLabel",
    ),
    todayTimeLabel: requireElement(
      `[${ATTR.TODAY_TIME_LABEL}]`,
      "todayTimeLabel",
    ),
    tomorrowTimeLabel: requireElement(
      `[${ATTR.TOMORROW_TIME_LABEL}]`,
      "tomorrowTimeLabel",
    ),

    toggleTimeVisibility: requireElements(
      `[${CHECK_STATES.TOGGLE_TIME_VISIBILITY}]`,
      "toggleTimeVisibility",
    ),
    timeContainer: requireElement(`[${ATTR.TIME_CONTAINER}]`, "timeContainer"),
    timeHoursEl: requireElement(`[${ATTR.TIME_HOURS}]`, "timeHoursEl"),
    timeMinutesEl: requireElement(`[${ATTR.TIME_MINUTES}]`, "timeMinutesEl"),
    clockFace: requireElement(`[${ATTR.CLOCK_FACE}]`, "clockFace"),
    cancelTime: requireElement(
      `[${ACTIONS.CANCEL_TIME_SELECTION}]`,
      "cancelTime",
    ),
    timePMEl: requireElement(`[${ATTR.TIME_PM}]`, "timePMEl"),
    timeAMEl: requireElement(`[${ATTR.TIME_AM}]`, "timeAMEl"),
    keyboardBtn: requireElement(
      `[${ACTIONS.SWITCH_TO_MANUAL_TYPE}]`,
      "keyboardBtn",
    ),
    clockBtn: requireElement(`[${ACTIONS.CLOCK_BTN}]`, "clockBtn"),
    taskDateEditor: requireElement(
      `[${ATTR.TASK_DATE_EDITOR}]`,
      "taskDateEditor",
    ),
    saveTimeBtn: requireElement(`[${ACTIONS.SAVE_TASK_TIME}]`, "saveTimeBtn"),
    clockBackdrop: requireElement(`[${ATTR.CLOCK_BACKDROP}]`, "clockBackdrop"),
    batchDueDateBtn: requireElement(
      `[${ACTIONS.BATCH_SET_DATE}]`,
      "batchDueDateBtn",
    ),
    /* end of the elements that are related to the todo app */
  };
  return elements;
};
