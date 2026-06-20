/* data attribute to get elements without relying CSS classes that makes JavaScript tightly coupled to CSS */
export const ATTR = {
  TASK_ITEM: "data-task-item",
  DEFAULT_LIST: "data-default-list",
  COMPLETED_LIST: "data-completed-list",
  TASK_DESCRIPTION: "data-task-description",
  TASK_TEXT: "data-task-text",
  MAIN_TASK_TEXT: "data-main-task-text",
  MAIN_TASK_DESCRIPTION: "data-main-task-description",
  // the menu that is in the main toolbar
  TOOLBAR_MENU: "data-menu",
  OTHER_ACTIONS: "data-other-actions-list",
  TASK_COMMENT_CON: "data-task-comment",
  TASK_INBOX_CON: "data-task-inbox-container",
  ACTION_BUTTONS_CON: "data-action-buttons-container",
  ACTIVE_SAVE_BTN: "data-save-button-active",
  TASK_TOOLBAR: "data-task-toolbar",
  SUB_TASK_CON: "data-sub-task-con",
  MAIN_DROPDOWN_LIST: "data-main-dropdown-list",
  NAV: "data-nav",
  UNDO_CONTAINER: "data-undo-container",
  UNDO_STATUS: "data-undo-status",
  WARNING_POPUP: "data-warning-popup",
  WARNING_MESSAGE: "data-warning-message",
  // toolbar that is in the selectin mode
  BATCH_TOOLBAR: "data-batch-toolbar",
  BATCH_MENU: "data-batch-menu",
  TASK_CREATOR: "data-task-creator",

  TASK_TEXT_ACTIVE: "data-task-text-active",
  DESCRIPTION_ACTIVE: "data-description-active",
  SELECT_TASK_ITEM: "data-select-task",
  SELECTION_BAR_CON: "data-selection-bar",

  HEADER_CONTAINER: "data-header-container",
  COMPLETION_STATUS: "data-completed-status",

  COMPLETED_LIST_SECTION: "data-completed-section",
  BATCH_DELETE_LABEL: "data-delete-label",
  BATCH_DUPLICATE_LABEL: "data-duplicate-label",
  BATCH_COMPLETE_LABEL: "data-completed-label",
  TASKS_COUNTER: "data-task-counter",

  WARNING_HEADING: "data-warning-heading",

  DRAGGING_TASK: "data-dragging-task",
  DROP_TARGET_HIGHLIGHT: "data-drop-target-highlight",
};

// elements that perform actions
export const ACTIONS = {
  DELETE: "data-action='delete-task'",
  EDIT: "data-action='edit-task'",
  DUPLICATE: "data-action='duplicate-task'",
  COMPLETE_TASK: "data-checkbox='complete-task'",
  UNCOMPLETE_TASK: "data-checkbox='uncomplete-task'",
  SAVE_EDIT: "data-action='save-edited-task'",
  EXIT_EDIT: "data-action='exit-edit'",
  IMPORTANT_TASK: "data-action='mark-task-important'",
  TASK_TOOLBAR: "data-action='open-task-toolbar'",
  OPEN_TOOLBAR_MENU: "data-action='open-toolbar-menu'",
  LABEL: "data-action='task-label'",
  SUB_TASK: "data-action='add-sub-task'",
  DESCRIPTION: "data-action='add-task-description'",
  DEADLINE: "data-action='add-task-deadline'",
  MOVE_TASK: "data-action='move-task'",
  LOCATION: "data-action='add-task-location'",
  COMMENT: "data-action='add-task-comment'",
  CLOSE_TOOLBAR: "data-action='close-toolbar'",
  TASK_REMINDER: "data-action='set-reminder'",
  PROIORITY: "data-action='add-task-proirity'",
  TASK_DATE: "data-action='add-task-date'",
  ACTIVITY_LOG: "data-action='log-activities'",
  TOGGLE_DROPDOWN_LIST: 'data-action="toggle-dropdown-list"',
  EXIT_TASK_SELECTION: "data-action='exit-task-selection'",
  SELECT_TASK_ITEM: 'data-action="enter-selection-mode"',
  ADD_TASK: "data-action='add-new-task'",
  TOGGLE_BATCH_MENU: "data-action='toggle-batch-menu'",
  BATCH_DELETE_TASKS: "data-action='batch-delete-tasks'",
  BATCH_DUPLICATE_TASKS: "data-action='batch-duplicate-tasks'",
  BATCH_COMPLETE_TASKS: "data-action='batch-complete-tasks'",
  BATCH_SET_DEADLINE: "data-action='batch-set-deadline'",
  UNDO_COMPLETION_BTN: "data-action='undo-completion'",
  CANCEL_DELETION: "data-action='cancel-deletion'",
  CONFIRM_DELETION: "data-action='confirm-deletion'",
  BATCH_SET_DATE: "data-action='batch-set-date'",
  BATCH_MOVE_TASKS: "data-action='batch-move-tasks'",
  BATCH_ADD_LABEL: "data-action='batch-add-label'",
  BATCH_SET_PRIORITY: "data-action='batch-set-priority'",
};

// check states using selectors
export const CHECK_STATES = {
  UNRELATED_ELS: "data-unrelated-elements-state",
  ACTION_BUTTONS_CONTAINER_STATE: "data-action-buttons-container-state",
  TOOLBAR_OVERLAY_STATE: "data-toolbar-overlay-state",
  TOOLBAR_MENU: "data-menu-state",
  TASK_TEXT_ACTIVE: "data-task-text-state",
  TASK_DESCRIPTION_ACTIVE: "data-description-state",
  TASK_TOOLBAR: "data-toolbar-state",
  TOOLBAR_FULL_HEIGHT: "data-toolbar-full-height",
  // highlighted task items
  SELECTED_TASK: "data-selected-tasks",
};

// get or set state attributes in JS
export const ATTR_STATES = {
  TASK_TOOLBAR: "toolbarState",
  TASK_MENU: "menuState",
  // this batch toolbar is in the selection mode
  BATCH_TOOLBAR: "batchToolbarState",
  DROPDOWN_LIST: "dropdownListState",
  // the batch menu is in the batch toolbar
  BATCH_MENU: "batchMenuState",
  // unrelated elements to the edit mode
  UNRELATED_ELS: "unrelatedElementsState",
  // unrelated elements to selection mode
  UNRELATED_ELS_TO_SELECTION: "unrelatedElementState",
  SELECTION_BAR: "selectionBarState",
  ACTION_BUTTONS_CON: "actionButtonsContainerState",
  SAVE_BUTTON_ACTIVE: "saveButtonActive",
  TASK_TEXT_STATE: "taskTextState",
  DESCRIPTION_STATE: "descriptionState",
  TOOLBAR_OVERLAY: "toolbarOverlayState",
  DESCRIPTION_ACTIVE: "descriptionActive",
  TASK_TEXT_ACTIVE: "taskTextActive",
  SELECT_TASK_ITEM_STATE: "selectTaskState",
  SELECTION_BAR_CON: "selectionBarState",
  TASK_CREATOR_STATE: "taskCreatorState",
  HIGHLIGHT_SELECTED_TASK: "selectedTasks",
  DRAGGING_TASK: "draggingTask",
  DROP_TARGET_HIGHLIGHT: "dropTargetHighlight",
  TOOLBAR_FULL_HEIGHT: "toolbarFullHeight",
  UNDO_CON: "undoState",
  COMPLETED_LIST_SECTION: "completedSectionState",
  POPUP_STATE: "popupState",
  TASKS_COUNTER: "taskCounterState",
  CHECKbOX: "checkbox",
};

export const VISIBLE = {
  ACTION_BUTTONS_CON: "visible",
  SELECT_TASK_ITEM: "visible",
  TASK_CREATOR: "visible",
};

export const HIDDEN = {
  UNRELATED_ELS: "hidden",
  ACTION_BUTTONS_CON: "hidden",
  SELECT_TASK_ITEM: "hidden",
  TASK_CREATOR: "hidden",

  /* some elements do not have visible state because they are temprary and once a mode is over they get deleted */
  TASK_TEXT: "hidden",
  TASK_DESCRIPTION: "hidden",
};

export const OPEN = {
  TASK_MENU: "open",
  TASK_TOOLBAR: "open",
  // this is the main dropdown list
  MAIN_DROPDOWN: "open",
  BATCH_TOOLBAR: "open",
  BATCH_MENU: "open",
};

export const CLOSED = {
  TASK_MENU: "closed",
  TASK_TOOLBAR: "closed",
  MAIN_DROPDOWN: "closed",
  BATCH_TOOLBAR: "closed",
  BATCH_MENU: "closed",
};

export const ACTIVE = {
  SELECTION_BAR: "active",
  TOOLBAR_OVERLAY: "active",
  UNDO_CON: "active",
  COMPLETED_SECTION: "active",
  POPUP: "active",
  TASKS_COUNTER: "active",
};

export const INACTIVE = {
  SELECTION_BAR: "inactive",
  TOOLBAR_OVERLAY: "inactive",
  UNDO_CON: "inactive",
  COMPLETED_SECTION: "inactive",
  POPUP: "inactive",
  TASKS_COUNTER: "inactive",
};

export const EDIT_MODES = {
  EDIT_TASK: "edit-task",
  DESCRIPTION: "Description",
  SWITCH_BETWEEN_MODES: "switch-between-modes",
  NO_MODES: "none",
};

export const UNDO_STATES = {
  UNDO_COMPLETED: "single-completed",
  UNDO_UNCOMPLETED: "single-uncompleted",
  UNDO_SEVERAL_COMPLETED: "several-completed",
  UNDO_SEVERAL_UNCOMPLETED: "several-uncompleted",
  NO_UNDO: "none",
};

export const SELECTION_BAR = {
  COMPLETED_LIST: "completed",
  ACTIVE_LIST: "active-list",
};

export const HIGHLIGHT_SELECTED_TASK = {
  SELECTED: "true",
  UNSELECTED: "false",
};

export const DELETION_MODES = {
  NONE: "none",
  SINGLE: "single",
  BATCH: "batch",
};
