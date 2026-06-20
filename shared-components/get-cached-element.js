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
    /* end of the elements that are related to the todo app */
  };
  return elements;
};
