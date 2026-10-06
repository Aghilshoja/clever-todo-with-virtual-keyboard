import { PLACEHOLDERS } from "../../constants/keyboard-constants.js";
import {
  ACTIVE,
  ATTR_STATES,
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
};

const saveSection = () => {
  if (appStateUi.lastClickedEl) {
    appStateUi.lastClickedEl.textContent = elements.inputElement.textContent;

    const className = "sections__enter-section-description";

    if (appStateUi.lastClickedEl.classList.contains(className)) {
      appStateUi.sectionObject.description = elements.inputElement.textContent;
      elements.sectionDescriptionBtn.textContent = "Description";
      elements.sectionDescriptionBtn.style = "block";
    } else {
      appStateUi.sectionObject.sectionName = elements.inputElement.textContent;
      elements.enterSectionNameBtn.textContent = "Section name";
      elements.enterSectionNameBtn.style.display = "block";
    }
  }

  const section = createSection();
  elements.sectionListContainer.appendChild(section);
  elements.circleEl.after(elements.inputElement);
  elements.sectionFormContainer.dataset[ATTR_STATES.FORM_SECTION] =
    INACTIVE.FORM_SECTION;

  lists.default.sections.push(appStateUi.sectionObject);
  appStateUi.sectionObject = null;
  cancelAddingSection();
  truncateSectionDescription();
  truncateSectionName();
  hideOrShowTaskEmptyStateBasedOnSections();
};

const showSectionUi = () => {
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

  const sectionObject = {
    id: lists.default.generateId(),
    sectionName: null,
    description: null,
    tasks: [],
  };

  appStateUi.sectionObject = sectionObject;
  appStateUi.lastClickedEl = elements.enterSectionNameBtn;
  elements.saveSectionBtn.disabled = true;
  renderPlaceholder();
  virtualKeyboard.updateAutoCaps();
};

export { saveSection, showSectionUi, cancelAddingSection };
