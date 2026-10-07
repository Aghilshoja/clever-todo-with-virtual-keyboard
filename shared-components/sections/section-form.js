import { PLACEHOLDERS } from "../../constants/keyboard-constants.js";
import {
  ACTIONS,
  ACTIVE,
  ADD_SECTION,
  ATTR_STATES,
  EDIT_MODES,
  HIDDEN,
  INACTIVE,
} from "../../constants/todo-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { disableSubmitIfInputEmpty } from "../../keyboard-view/keyboard-input-behavior.js";
import { keyboardUiState } from "../../keyboard-view/keyboard-states/states.js";
import { toggleKeyboard } from "../../keyboard-view/toggle-keyboard.js";
import { elements, lists } from "../../todos-controller/todos-controller.js";
import { appStateUi } from "../todo-states/states.js";
import {
  truncateSectionDescription,
  truncateSectionName,
} from "../truncate-task.js";
import { createSection } from "./section-dom-operation.js";
import {
  fadeKeyboardOptions,
  hideOrShowTaskEmptyStateBasedOnSections,
  renderPlaceholder,
  restoreDraftedTask,
} from "./section-helpers.js";

const resetSectionFormFields = () => {
  elements.sectionDescriptionBtn.textContent = PLACEHOLDERS.SECTION_DESCRIPTION;
  elements.enterSectionNameBtn.textContent = PLACEHOLDERS.SECTION_NAME;
  elements.enterSectionNameBtn.style.display = "block";
  elements.sectionDescriptionBtn.style.display = "block";
};

const cancelAddingSection = () => {
  keyboardUiState.activePlaceholder = PLACEHOLDERS.ENTER_TASK;
  elements.sectionFormContainer.dataset[ATTR_STATES.FORM_SECTION] =
    INACTIVE.FORM_SECTION;

  fadeKeyboardOptions((el) => delete el.dataset[ATTR_STATES.UNRELATED_ELS]);
  elements.circleEl.after(elements.inputElement);

  if (elements.inputElement.classList.contains("section-name")) {
    elements.inputElement.classList.remove("section-name");
  }

  renderPlaceholder();
  disableSubmitIfInputEmpty();
  restoreDraftedTask();
  resetSectionFormFields();
};

const finalizeSectionCreation = () => {
  cancelAddingSection();
  truncateSectionName();
  truncateSectionDescription();
  hideOrShowTaskEmptyStateBasedOnSections();
};

const commitSectionFieldText = () => {
  if (appStateUi.lastClickedEl) {
    appStateUi.lastClickedEl.textContent = elements.inputElement.textContent;

    const className = "sections__enter-section-description";

    if (appStateUi.lastClickedEl.classList.contains(className)) {
      appStateUi.sectionObject.description = elements.inputElement.textContent;
    } else {
      appStateUi.sectionObject.sectionName = elements.inputElement.textContent;
    }
  }

  if (elements.inputElement.classList.contains("section-name")) {
    elements.inputElement.classList.remove("section-name");
  }

  resetSectionFormFields();
};

const addSection = () => {
  commitSectionFieldText();

  const section = createSection();
  elements.sectionListContainer.appendChild(section);
  elements.circleEl.after(elements.inputElement);
  elements.sectionFormContainer.dataset[ATTR_STATES.FORM_SECTION] =
    INACTIVE.FORM_SECTION;

  lists.default.sections.push(appStateUi.sectionObject);
  finalizeSectionCreation();
};

const editSection = () => {
  commitSectionFieldText();
  finalizeSectionCreation();
  const sectionNameEl = document.querySelector(
    `[${ACTIONS.EDIT_SECTION_NAME}][data-id="${appStateUi.sectionObject.id}"]`,
  );

  if (sectionNameEl) {
    sectionNameEl.textContent = appStateUi.sectionObject.sectionName;
    sectionNameEl.dataset.truncateText = appStateUi.sectionObject.sectionName;
  }

  const sectionDescriptionEl = document.querySelector(
    `[${ACTIONS.EDIT_SECTION_DESCRIPTION}][data-id="${appStateUi.sectionObject.id}"]`,
  );

  if (sectionDescriptionEl) {
    sectionDescriptionEl.textContent = appStateUi.sectionObject.description;
    sectionDescriptionEl.dataset.truncateText =
      appStateUi.sectionObject.description;
  } else if (appStateUi.sectionObject.description) {
    const desEl = `<button
                  class="section-item__description button-reset fs word-wrap"
                  data-id="${appStateUi.sectionObject.id}"
                  data-action="edit-section-description"
                  data-truncate-text="${appStateUi.sectionObject.description}"
                >${appStateUi.sectionObject.description}</button>`;

    const template = document.createElement("div");
    template.innerHTML = desEl;

    sectionNameEl.after(template.firstElementChild);
  }
};

const saveSection = () => {
  const isAddSection = appStateUi.addSectionMode === ADD_SECTION.SECTION;
  const isEditSection = appStateUi.activeMode === EDIT_MODES.EDIT_SECTION;

  if (isAddSection) {
    addSection();
    appStateUi.addSectionMode = null;
    appStateUi.sectionObject = null;
  } else if (isEditSection) {
    editSection();
    appStateUi.activeMode = EDIT_MODES.NO_MODES;
    appStateUi.sectionObject = null;
  }
};

const enterSectioFormUi = () => {
  elements.sectionFormContainer.dataset[ATTR_STATES.FORM_SECTION] =
    ACTIVE.FORM_SECTION;
  keyboardUiState.activePlaceholder = PLACEHOLDERS.SECTION_NAME;

  fadeKeyboardOptions(
    (el) => (el.dataset[ATTR_STATES.UNRELATED_ELS] = HIDDEN.UNRELATED_ELS),
  );

  toggleKeyboard();
  elements.enterSectionNameBtn.style.display = "none";
  elements.enterSectionNameBtn.after(elements.inputElement);
  elements.inputElement.classList.add("section-name");

  appStateUi.lastClickedEl = elements.enterSectionNameBtn;
  elements.saveSectionBtn.disabled = true;
  renderPlaceholder();
};

const showSectionUi = () => {
  const sectionObject = {
    id: lists.default.generateId(),
    sectionName: null,
    description: null,
    tasks: [],
  };

  appStateUi.sectionObject = sectionObject;

  appStateUi.addSectionMode = ADD_SECTION.SECTION;
  enterSectioFormUi();
  virtualKeyboard.updateAutoCaps();
};

export { saveSection, showSectionUi, cancelAddingSection, enterSectioFormUi };
