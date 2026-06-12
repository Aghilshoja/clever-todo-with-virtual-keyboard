import { getCachedElements } from "../get-cached-element.js";
import { appStateUi } from "../../todos-controller.js/todos-controller.js";
import { ensurePlaceholder } from "../../keyboard-view/keyboard-input-behavior.js";
import { disableSubmitIfInputEmpty } from "../../keyboard-view/keyboard-input-behavior.js";
import { toggleKeyboard } from "../../keyboard-view/toggle-keyboard.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { saveInputText } from "../save-drafted-text-input-to-local-storage.js";
import { PLACEHOLDERS } from "../../constants/keyboard-constants.js";
import { keyboardUiState } from "../../keyboard-controler/keyboard-controler.js";
import {
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  CLOSED,
  EDIT_MODES,
  HIDDEN,
  INACTIVE,
} from "../../constants/todo-constants.js";
import { getRepetitiveElements } from "./shared-entering-edit-or-description-modes-ui.js";
import { closeKeyboard } from "../../keyboard-view/closeKeyboardOnBodyClick.js";

const elements = getCachedElements();

const renderUnrelatedElements = () => {
  const unrelatedEls = document.querySelectorAll(
    `[${CHECK_STATES.UNRELATED_ELS}]`,
  );
  if (unrelatedEls)
    unrelatedEls.forEach(
      (unrelatedEls) => delete unrelatedEls.dataset[ATTR_STATES.UNRELATED_ELS],
    );
};

const putInputElementWhereThatWas = () => {
  if (elements.circleEl) elements.circleEl.after(elements.inputElement);
};

const cleanupEditModeUi = (toolbar) => {
  if (!toolbar) return;
  const repetitiveElements = getRepetitiveElements(toolbar);
  if (!repetitiveElements.taskTextEl) return;
  const taskEl = repetitiveElements.taskTextEl;
  delete taskEl.dataset[ATTR_STATES.TASK_TEXT_STATE];
  delete taskEl.dataset[ATTR_STATES.TASK_TEXT_ACTIVE];
  putInputElementWhereThatWas();
};

const cleanupDescriptioinModeUi = (toolbar) => {
  if (!toolbar) return;
  const repetitiveElements = getRepetitiveElements(toolbar);
  if (!repetitiveElements.description) return;
  const descriptionEl = repetitiveElements.description;
  delete descriptionEl.dataset[ATTR_STATES.DESCRIPTION_STATE];
  delete descriptionEl.dataset[ATTR_STATES.DESCRIPTION_ACTIVE];
  putInputElementWhereThatWas();
};

const deactiviateToolbar = (toolbar) => {
  if (!toolbar) return;
  toolbar.dataset[ATTR_STATES.TASK_TOOLBAR] = CLOSED.TASK_TOOLBAR;
  delete toolbar.dataset[ATTR_STATES.TOOLBAR_FULL_HEIGHT];

  const repetitiveElements = getRepetitiveElements(toolbar);
  const actionButtonsContainer = repetitiveElements.actionButtonsContainer;
  const activeSaveButton = repetitiveElements.activeSaveBtn;
  const activeMenu = repetitiveElements.activeManu;

  if (actionButtonsContainer && activeSaveButton && activeMenu) {
    actionButtonsContainer.dataset[ATTR_STATES.ACTION_BUTTONS_CON] =
      HIDDEN.ACTION_BUTTONS_CON;
    activeSaveButton.disabled = true;
    delete activeSaveButton.dataset[ATTR_STATES.SAVE_BUTTON_ACTIVE];
    // if menu wass open close it
    activeMenu.dataset[ATTR_STATES.TASK_MENU] = CLOSED.TASK_MENU;
  }

  if (!repetitiveElements.description || !repetitiveElements.taskTextEl) return;
  const description = repetitiveElements.description;

  if (
    description.textContent.trim() === "" ||
    description.textContent === PLACEHOLDERS.DESCRIPTION
  ) {
    description.parentElement.classList.remove("pd");
    description.textContent = "";
  } else if (
    description.textContent !== PLACEHOLDERS.DESCRIPTION ||
    description.textContent.trim() !== ""
  )
    description.parentElement.classList.add("pd");

  const removeToolbarOverlay = toolbar.previousElementSibling;
  if (removeToolbarOverlay)
    removeToolbarOverlay.dataset[ATTR_STATES.TOOLBAR_OVERLAY] =
      INACTIVE.TOOBAR_OVERLAY;
};

// Restores the user's unsubmitted task draft after leaving edit mode.
/* Discards any edits made to an existing task and reinserts the previously saved draft into the input field. */
const restoreDraftBackupAfterEditMode = () => {
  const input = elements.inputElement;
  if (!input) return;
  if (
    input.dataset.draft !== "" &&
    input.dataset.draft !== PLACEHOLDERS.ENTER_TASK
  ) {
    input.textContent = "";
    const caret = ensureCaret(input);
    caret.insertAdjacentText("beforebegin", input.dataset.draft);
    saveInputText();
  } else {
    input.textContent = "";
    ensurePlaceholder(input);
    saveInputText();
  }
};

const resetOtherPartsAsWell = (event) => {
  keyboardUiState.activePlaceholder = PLACEHOLDERS.ENTER_TASK;
  restoreDraftBackupAfterEditMode();
  disableSubmitIfInputEmpty();
  closeKeyboard();
  appStateUi.activeMode = EDIT_MODES.NO_MODES;
};

export const cleanupDescriptionUi = (toolbar, event) => {
  cleanupDescriptioinModeUi(toolbar);
  deactiviateToolbar(toolbar);
  renderUnrelatedElements(toolbar);
  resetOtherPartsAsWell(event);
};

export const cleanupEditUi = (toolbar, event) => {
  cleanupEditModeUi(toolbar);
  deactiviateToolbar(toolbar);
  renderUnrelatedElements(toolbar);
  resetOtherPartsAsWell(event);
};

export const cleanupDescriptionAndEditUi = (toolbar, event) => {
  cleanupDescriptioinModeUi(toolbar);
  cleanupEditModeUi(toolbar);
  deactiviateToolbar(toolbar);
  renderUnrelatedElements(toolbar);
  resetOtherPartsAsWell(event);
};
