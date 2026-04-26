import { getCachedElements } from "../get-cached-element.js";
import { appStateUi } from "../../todos-controller.js/todos-controller.js";
import { ensurePlaceholder } from "../../keyboard-view/keyboard-input-behavior.js";
import { disableSubmitIfInputEmpty } from "../../keyboard-view/keyboard-input-behavior.js";
import { toggleKeyboard } from "../../keyboard-view/toggle-keyboard.js";

const elements = getCachedElements();

const renderUnrelatedElements = (toolbar) => {
  if (!toolbar) return;
  const showUnrelatedEls = document.querySelectorAll(".hide-unrelated-els");
  if (showUnrelatedEls)
    showUnrelatedEls.forEach((unrelatedEls) =>
      unrelatedEls.classList.remove("hide-unrelated-els"),
    );
};

const cleanupEditModeUi = (toolbar) => {
  const taskEl = toolbar.querySelector(".task__toolbar-task-text");
  if (!taskEl) return;
  taskEl.classList.remove("hide-task-text");
  if (elements.circleEl) elements.circleEl.after(elements.inputElement);
};

const cleanupDescriptioinModeUi = (toolbar) => {
  if (!toolbar) return;
  if (elements.inputElement) {
    const descriptionEl = toolbar.querySelector(
      ".task__toolbar-description-text",
    );
    if (!descriptionEl) return;
    descriptionEl.classList.remove("hide-task-description");
    if (elements.circleEl) elements.circleEl.after(elements.inputElement);
  }
};

const deactiviateToolbar = (toolbar) => {
  if (!toolbar) return;
  toolbar.classList.remove("toolbar-action--active");
  toolbar.classList.remove("toolbar--active");
  const editPageUi = toolbar.querySelector(".task__edit-page");
  if (editPageUi) editPageUi.classList.remove("task__edit-page--active");
  // get save button using the class name that is given to it before to disable it again
  const saveButton = toolbar.querySelector(".task__save-edited-task--active");
  if (saveButton) {
    saveButton.disabled = true;
    saveButton.classList.remove("task__save-edited-task--active");
  }

  const activeManu = toolbar.querySelector(".manu--active");
  if (activeManu) activeManu.classList.remove("manu--active");

  const description = toolbar.querySelector(".task__toolbar-description-text");
  if (
    description.textContent.trim() === "" ||
    description.textContent === "Description"
  ) {
    description.parentElement.classList.remove("pd");
    description.classList.remove("pd");
    description.textContent = "";
  } else if (
    description.textContent !== "Description" ||
    description.textContent.trim() !== ""
  ) {
    description.classList.remove("pd");
    description.parentElement.classList.add("pd");
  }

  const removeToolbarOverlay = toolbar.previousElementSibling;
  if (removeToolbarOverlay)
    removeToolbarOverlay.classList.remove("close-toolbar--active");
  const activeTaskText = document.querySelector(
    ".task__toolbar-task-text--active",
  );
  if (activeTaskText)
    activeTaskText.classList.remove("task__toolbar-task-text--active");
  const activeDescriptionEl = document.querySelector(
    ".task__toolbar-description-text--active",
  );
  if (activeDescriptionEl)
    activeDescriptionEl.classList.remove(
      "task__toolbar-description-text--active",
    );
};

const resetOtherPartsAsWell = (event) => {
  appStateUi.activePlaceholder = "Enter-a-task";
  elements.inputElement.textContent = "";
  ensurePlaceholder(elements.inputElement);
  disableSubmitIfInputEmpty();
  toggleKeyboard(event);
  appStateUi.activeMode = "none";
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
