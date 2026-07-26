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

export const getCachedElements = () => {
  const elements = {
    splashHeader: document.querySelector(
      `[${SPLSASH_HEADER_ATTR.SPLASH_HEADER}]`,
    ),
    mainPage: document.querySelector(`[${SPLSASH_HEADER_ATTR.MAIN_PAGE}]`),
    loaderDot: document.querySelector(`[${SPLSASH_HEADER_ATTR.LOADING}]`), // fixed a typo
    /* end of the related elements to the logo of the app */

    /* elements that are just related to the keyboard */
    keyboardSection: document.querySelector(`[${ATTRIBUTES.KEYBOARD_SECTION}]`),
    previewFeedback: document.querySelector(`[${ATTRIBUTES.KEY_PREVIEW}]`),
    keyboardDismissOverlay: document.querySelector(
      `[${ATTRIBUTES.KEYBOARD_OVERLAY}]`,
    ),
    keyboardContainer: document.querySelector(
      `[${ATTRIBUTES.KEYBOARD_CONTAINER}]`,
    ),
    unrelatedKeyboardOptions: document.querySelectorAll(
      `[${ATTRIBUTES.KEYBOARD_TIME_OPTIONS}], [${ATTRIBUTES.INPUT_CONTAINER}]`,
    ),
    inputElement: document.querySelector(`[${ATTRIBUTES.INPUT}]`),
    submitTask: document.querySelector(`[${KEYBOARD_ACTIONS.SUBMIT}]`),
    inputCharacterLimit: document.querySelector(
      `[${ATTRIBUTES.CHARACTER_LIMIT_COUNT}]`,
    ),
    circleEl: document.querySelector(`[${ATTRIBUTES.INPUT_ANCHOR}]`),
    unrelatedKeyboardOptions: document.querySelectorAll(
      `[${ATTRIBUTES.KEYBOARD_TIME_OPTIONS}], [${ATTRIBUTES.INPUT_CONTAINER}]`,
    ),
    /* end of the elements that are related to the keyboard */

    /* elements that are just related to the todo app */
    activateToolbarButtons: document.querySelectorAll(
      `[${ACTIONS.BATCH_SET_DATE}], [${ACTIONS.BATCH_MOVE_TASKS}], [${ACTIONS.BATCH_ADD_LABEL}], [${ACTIONS.BATCH_SET_PRIORITY}], [${ACTIONS.BATCH_DELETE_TASKS}], [${ACTIONS.BATCH_DUPLICATE_TASKS}], [${ACTIONS.BATCH_COMPLETE_TASKS}]`,
    ),
    deleteHeading: document.querySelector(`[${ATTR.WARNING_HEADING}]`),
    batchDeleteTasks: document.querySelector(`[${ACTIONS.BATCH_DELETE_TASKS}]`),
    batchDuplicateTasks: document.querySelector(
      `[${ACTIONS.BATCH_DUPLICATE_TASKS}]`,
    ),
    batchCompletedTasks: document.querySelector(
      `[${ACTIONS.BATCH_COMPLETE_TASKS}]`,
    ),
    mainPageNewTask: document.querySelector(`[${ACTIONS.ADD_TASK}]`),
    mainPageNewTaskCon: document.querySelector(`[${ATTR.TASK_CREATOR}]`),
    navigation: document.querySelector(`[${ATTR.NAV}]`),
    mainPageFlexContainer: document.querySelector(`[${ATTR.HEADER_CONTAINER}]`),
    warningPopup: document.querySelector(`[${ATTR.WARNING_POPUP}]`),
    warningMessage: document.querySelector(`[${ATTR.WARNING_MESSAGE}]`),
    taskCounter: document.querySelector(`[${ATTR.TASKS_COUNTER}]`),
    undoCompletion: document.querySelector(`[${ATTR.UNDO_CONTAINER}]`),
    undoCompletedTask: document.querySelector(
      `[${ACTIONS.UNDO_COMPLETION_BTN}]`,
    ),
    completionStatusLabel: document.querySelector(`[${ATTR.UNDO_STATUS}]`),
    dropDownList: document.querySelector(`[${ATTR.MAIN_DROPDOWN_LIST}]`),
    selectionBar: document.querySelector(`[${ATTR.SELECTION_BAR_CON}]`),
    batchToolbar: document.querySelector(`[${ATTR.BATCH_TOOLBAR}]`),
    mainPageBatchMenu: document.querySelector(`[${ATTR.BATCH_MENU}]`),
    selectedTasksCount: document.querySelector(`[${ATTR.SELECTED_COUNT}]`),
    toggleSelectionMenu: document.querySelector(
      `[${ACTIONS.SELECTION_MENU_TOGGLER}]`,
    ),
    selectionBarMenu: document.querySelector(`[${ATTR.SELECTION_BAR_MENU}]`),
    dateContainer: document.querySelector(`[${ATTR.DATE_CONTAINER}]`),
    calendarContainer: document.querySelector(`[${ATTR.CALENDAR_CONTAINER}]`),
    calendarHeader: document.querySelector(`[${ATTR.CALENDAR_HEADER}]`),
    previousMonthBtn: document.querySelector(
      `[${ACTIONS.TOGGLE_PREVIOUS_MONTH}]`,
    ),
    nextMonthBtn: document.querySelector(`[${ACTIONS.TOGGLE_NEXT_MONTH}]`),
    todayLabel: document.querySelector(`[${ATTR.TODAY_LABEL}]`),
    tomorrowLabel: document.querySelector(`[${ATTR.TOMORROW_LABEL}]`),
    nextWeekLabel: document.querySelector(`[${ATTR.NEXT_WEEK_LABEL}]`),
    editDueDateBtn: document.querySelector(`[${ACTIONS.EDIT_TASK_DATE}]`),
    quickOptionsContainer: document.querySelector(
      `[${ATTR.QUICK_OPTIONS_CONTAINER}]`,
    ),
    saveTaskDate: document.querySelector(`[${ACTIONS.SAVE_TASK_DATE}]`),
    saveButtonContainer: document.querySelector(
      `[${ATTR.SAVE_BUTTON_CONTAINER}]`,
    ),
    taskDateSuggestion: document.querySelector(`[${ATTR.DATA_SUGGESTION}]`),
    noDateBtnContainer: document.querySelector(`[${ATTR.NO_DATE_CONTAINER}]`),
    todayContainer: document.querySelector(`[${ATTR.TODAY_CONTANIER}]`),
    tomorrowContainer: document.querySelector(`[${ATTR.TOMORROW_CONTAINER}]`),
    nextWeekContainer: document.querySelector(`[${ATTR.NEXT_WEEK_CONTAINER}]`),
    todayBtn: document.querySelector(`[${ACTIONS.SET_TODAY}]`),
    tomorrowBtn: document.querySelector(`[${ACTIONS.SET_TOMORROW}]`),
    nextWeekBtn: document.querySelector(`[${ACTIONS.SET_NEXT_WEEK}]`),
    noDateBtn: document.querySelector(`[${ACTIONS.NO_DATE_BTN}]`),
    addTimeBtn: document.querySelector(`[${ACTIONS.ADD_TIME}]`),
    removeTimeBtn: document.querySelector(`[${ACTIONS.REMOVE_TASK_TIME}]`),
    nextWeekTimeLabel: document.querySelector(`[${ATTR.NEXT_WEEK_TIME_LABEL}]`),
    todayTimeLabel: document.querySelector(`[${ATTR.TODAY_TIME_LABEL}]`),
    tomorrowTimeLabel: document.querySelector(`[${ATTR.TOMORROW_TIME_LABEL}]`),

    toggleTimeVisibility: document.querySelectorAll(
      `[${CHECK_STATES.TOGGLE_TIME_VISIBILITY}]`,
    ),
    /* end of the elements that are related to the todo app */
  };
  return elements;
};
