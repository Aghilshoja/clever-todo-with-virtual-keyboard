/* data attribute to get elements without relying CSS classes that makes JavaScript tightly coupled to CSS */

export const ATTRIBUTES = {
  INPUT: "data-keyboard-input",
  REGULAR_KEY: "data-key-type",
  KEYBOARD_TIME_OPTIONS: "data-keyboard-time-options",
  INPUT_CONTAINER: "data-input-container",
  KEYBOARD_SECTION: "data-keyboard-section",
  KEYBOARD_OVERLAY: "data-keyboard-overlay",
  KEY_PREVIEW: "data-key-preview",
  INPUT_ANCHOR: "data-input-anchor",
  KEYBOARD_CONTAINER: "data-keyboard-container",
  CHARACTER_LIMIT_COUNT: "data-character-limit-counter",
  CARET: "data-caret",
};

// action-oriented buttons
export const KEYBOARD_ACTIONS = {
  SUBMIT: 'data-action="submit-task"',
  SHIFT_KEY: "data-action='caps-lock'",
  BACKSPACE: 'data-action="backspace"',
  SPACE: 'data-action="space-bar"',
  SWITCH_TO_EN: "data-action='switch-to-en'",
  SWITCH_TO_FA: "data-action='switch-to-fa'",
  SWITCH_TO_SYM: "data-action='switch-to-symbols'",
  SET_DUE_DATE: "data-action='set-due-date'",
  SET_REMINDER: "data-action='set-reminder'",
  SET_REPEAT: "data-action='set-repeat'",
  SECOND_SYMBOLS_PAGE: "data-action='switch-second-page-symbols'",
  FIRST_SYMBOLS_PAGE: "data-action='switch-first-page-symbols'",
};

export const KB_CHECK_STATES = {
  DRAGGING_HIGHLIGHT: "data-dragging-highlight",
};

export const KEYBOARD_STATES = {
  DRAGGING_KEY: "draggingKey",
  DRAGGING_HIGHLIGHT: "draggingHighlight",
  KEYBOARD: "keyboardState",
  OVERLAY_STATE: "overlayState",
  SHIFT_KEY_STATE: "shiftKeyState",
  CHARACTER_LIMIT_COUNTER: "characterLimitState",
  CARET: "caret",
  INPUT_CARET: "inputCaret",
};

export const PLACEHOLDERS = {
  EDIT_TASK: "Edit your task",
  ENTER_TASK: "Enter a task",
  DESCRIPTION: "Description",
};

export const KEYBOARD_OPEN = {
  KEYBOARD: "open",
};

export const KEYBOARD_CLOSED = {
  KEYBOARD: "closed",
};

export const KEYBOARD_ACTIVE = {
  OVERLAY: "active",
  SHIFT_KEY: "active",
  CHARACTER_LIMIT: "active",
  CARET: "active",
};

export const KEYBOARD_INACTIVE = {
  OVERLAY: "inactive",
  SHIFT_KEY: "inactive",
  CHARACTER_LIMIT: "inactive",
};

export const LOCAL_STORAGE_KEY = {
  TEXT_EDITOR: "text-editor-states",
};
