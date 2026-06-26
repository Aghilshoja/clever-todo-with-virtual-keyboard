import { lists } from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { appStateUi } from "../../todos-controller.js/todos-controller.js";
import {
  keyboardUiState,
  virtualKeyboard,
} from "../../keyboard-controler/keyboard-controler.js";
import {
  ATTRIBUTES,
  KEYBOARD_STATES,
  PLACEHOLDERS,
} from "../../constants/keyboard-constants.js";
import {
  ACTIONS,
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  EDIT_MODES,
  HIDDEN,
  VISIBLE,
  OPEN,
} from "../../constants/todo-constants.js";
import { renderKeyPreviewPopup } from "../../keyboard-view/keyboard-feedback-overlay.js";
import { updateEditorState } from "../save-drafted-text-input-to-local-storage.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";

const elements = getCachedElements();

export const getRepetitiveElements = (toolbar) => {
  const taskItem = toolbar.closest(`[${ATTR.TASK_ITEM}]`);
  // main visible task and description  that is not in the toolbar
  const taskItemText = taskItem.querySelector(`[${ATTR.MAIN_TASK_TEXT}]`);
  const taskItemDescription = taskItem.querySelector(
    `[${ATTR.MAIN_TASK_DESCRIPTION}]`,
  );
  // task and description is in the toolbar and is hidden initially
  const description = toolbar.querySelector(`[${ATTR.TASK_DESCRIPTION}]`);
  const taskTextEl = toolbar.querySelector(`[${ATTR.TASK_TEXT}]`);
  const actionButtonsContainer = toolbar.querySelector(
    `[${ATTR.ACTION_BUTTONS_CON}]`,
  );
  const activeSaveBtn = toolbar.querySelector(`[${ACTIONS.SAVE_EDIT}]`);
  const activeManu = toolbar.querySelector(`[${ATTR.TOOLBAR_MENU}]`);

  return {
    description,
    taskTextEl,
    actionButtonsContainer,
    activeSaveBtn,
    activeManu,
    taskItemText,
    taskItemDescription,
  };
};

const checkWhatIsClicked = (event) => {
  const editBtn = event.target.closest(`[${ACTIONS.EDIT}]`);
  if (editBtn) {
    appStateUi.activeMode = EDIT_MODES.EDIT_TASK;
    keyboardUiState.activePlaceholder = PLACEHOLDERS.EDIT_TASK;
  }
  const descriptionBtn = event.target.closest(`[${ACTIONS.DESCRIPTION}]`);
  if (descriptionBtn) {
    appStateUi.activeMode = EDIT_MODES.DESCRIPTION;
    keyboardUiState.activePlaceholder = PLACEHOLDERS.DESCRIPTION;
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
  const taskItem = event.target.closest(`[${ATTR.TASK_ITEM}]`);
  const toolbar = taskItem.querySelector(`[${ATTR.TASK_TOOLBAR}]`);
  if (!toolbar) return;
  return {
    toolbar,
    taskItem,
  };
};

const hideUnrelatedElements = (toolbar) => {
  if (!toolbar) return;
  if (elements.unrelatedKeyboardOptions)
    elements.unrelatedKeyboardOptions.forEach(
      (fade) =>
        (fade.dataset[ATTR_STATES.UNRELATED_ELS] = HIDDEN.UNRELATED_ELS),
    );
  const hideUnrelatedElements = toolbar.querySelectorAll(
    `[${ATTR.OTHER_ACTIONS}], [${ATTR.TASK_INBOX_CON}], [${ATTR.SUB_TASK_CON}], [${ACTIONS.TASK_DATE}], [${ATTR.TASK_COMMENT_CON}]`,
  );

  if (hideUnrelatedElements)
    hideUnrelatedElements.forEach(
      (fade) =>
        (fade.dataset[ATTR_STATES.UNRELATED_ELS] = HIDDEN.UNRELATED_ELS),
    );
};

const activiateToolbar = (toolbar) => {
  if (!toolbar) return;
  // Open toolbar
  toolbar.dataset[ATTR_STATES.TASK_TOOLBAR] = OPEN.TASK_TOOLBAR;
  // Set full height for edit mode
  toolbar.dataset[ATTR_STATES.TOOLBAR_FULL_HEIGHT] = "";

  updateEditorState("appState", EDIT_MODES.EDIT_TASK);

  if (virtualKeyboard.caretManeger.text.length > 0) {
    updateEditorState("draftedNewTask", virtualKeyboard.caretManeger.text);
    updateEditorState(
      "caretPosition",
      virtualKeyboard.caretManeger.caretPosition,
    );
  }
  const repetitiveElements = getRepetitiveElements(toolbar);
  const actionBtnsContainer = repetitiveElements.actionButtonsContainer;
  const description = repetitiveElements.description;
  const activeSaveButton = repetitiveElements.activeSaveBtn;
  const taskTextEl = repetitiveElements.taskTextEl;

  if (description && actionBtnsContainer) {
    actionBtnsContainer.dataset[ATTR_STATES.ACTION_BUTTONS_CON] =
      VISIBLE.ACTION_BUTTONS_CON;
    description.dataset[ATTR_STATES.DESCRIPTION_ACTIVE] = "";
    if (description.textContent.trim() === "")
      description.textContent = PLACEHOLDERS.DESCRIPTION;
  }

  if (activeSaveButton && taskTextEl) {
    taskTextEl.dataset[ATTR_STATES.TASK_TEXT_ACTIVE] = "";
    activeSaveButton.dataset[ATTR_STATES.SAVE_BUTTON_ACTIVE] = "";
  }
};

const moveInputAndHideTaskText = (toolbar, task) => {
  if (!toolbar) return;
  const input = elements.inputElement;
  if (!input) return;

  const repetitiveElements = getRepetitiveElements(toolbar);
  if (!repetitiveElements.taskTextEl) return;

  delete input.dataset[KEYBOARD_STATES.INPUT_CARET];
  repetitiveElements.taskTextEl.dataset[ATTR_STATES.TASK_TEXT_STATE] =
    HIDDEN.TASK_TEXT;
  repetitiveElements.taskTextEl.after(elements.inputElement);
  const caret = ensureCaret(elements.inputElement);
  virtualKeyboard.caretManeger.text = task.text;
  virtualKeyboard.caretManeger.caretPosition = task.text.length;

  updateTextEditor(input, caret);
};

const moveInputAndHideTaskDescription = (toolbar, task) => {
  if (!toolbar) return;
  if (!elements.inputElement) return;
  const repetitiveElements = getRepetitiveElements(toolbar);
  if (!repetitiveElements.description) return;
  const descriptionEl = repetitiveElements.description;

  repetitiveElements.description.dataset[ATTR_STATES.DESCRIPTION_STATE] =
    HIDDEN.TASK_DESCRIPTION;
  descriptionEl.after(elements.inputElement);
  if (task.description === null) {
    elements.inputElement.dataset[KEYBOARD_STATES.INPUT_CARET] = "";
    elements.inputElement.textContent = PLACEHOLDERS.DESCRIPTION;
    virtualKeyboard.resetCaretState();
  } else if (task.description !== null) {
    delete elements.inputElement.dataset[KEYBOARD_STATES.INPUT_CARET];
    const caret = ensureCaret(elements.inputElement);

    virtualKeyboard.caretManeger.text = task.description;
    virtualKeyboard.caretManeger.caretPosition = task.description.length;
    updateTextEditor(elements.inputElement, caret);
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
  activiateToolbar(toolbar);
  moveInputAndHideTaskText(toolbar, taskObject);
};

export const enterDescriptionMode = (toolbar, taskObject) => {
  hideUnrelatedElements(toolbar);
  activiateToolbar(toolbar);
  moveInputAndHideTaskDescription(toolbar, taskObject);
};
