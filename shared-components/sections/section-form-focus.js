import {
  KEYBOARD_STATES,
  PLACEHOLDERS,
} from "../../constants/keyboard-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { keyboardUiState } from "../../keyboard-view/keyboard-states/states.js";
import { toggleKeyboard } from "../../keyboard-view/toggle-keyboard.js";
import { elements } from "../../todos-controller/todos-controller.js";
import { appStateUi } from "../todo-states/states.js";
import { renderPlaceholder } from "./section-helpers.js";

const renderTextEditor = () => {
  const caret = ensureCaret(elements.inputElement);
  updateTextEditor(elements.inputElement, caret);
};

const moveFocusOnDescription = () => {
  delete elements.inputElement.dataset[KEYBOARD_STATES.INPUT_CARET];

  keyboardUiState.activePlaceholder = PLACEHOLDERS.SECTION_DESCRIPTION;
  elements.enterSectionNameBtn.style.display = "block";
  elements.sectionDescriptionBtn.style.display = "none";
  appStateUi.lastClickedEl = elements.sectionDescriptionBtn;
  elements.sectionDescriptionBtn.after(elements.inputElement);

  elements.enterSectionNameBtn.textContent = elements.inputElement.textContent;
  appStateUi.sectionObject.sectionName =
    elements.enterSectionNameBtn.textContent;

  const sectionName =
    elements.enterSectionNameBtn.textContent === PLACEHOLDERS.SECTION_NAME
      ? null
      : elements.enterSectionNameBtn.textContent;

  appStateUi.sectionObject.sectionName = sectionName;

  const isSectionDes =
    elements.enterSectionNameBtn.textContent.trim() !==
    PLACEHOLDERS.SECTION_NAME;

  if (isSectionDes) {
    elements.enterSectionNameBtn.classList.add("bold-section-name");
  } else {
    elements.enterSectionNameBtn.classList.remove("bold-section-name");
  }

  virtualKeyboard.caretManeger.text =
    elements.sectionDescriptionBtn.textContent.trim();
  virtualKeyboard.caretManeger.caretPosition =
    elements.sectionDescriptionBtn.textContent.trim().length;

  renderTextEditor();

  if (elements.inputElement.textContent === PLACEHOLDERS.SECTION_DESCRIPTION) {
    renderPlaceholder();
  }

  toggleKeyboard();
  virtualKeyboard.updateAutoCaps();
};

const moveFocusOnSectionName = () => {
  delete elements.inputElement.dataset[KEYBOARD_STATES.INPUT_CARET];
  keyboardUiState.activePlaceholder = PLACEHOLDERS.SECTION_NAME;

  elements.sectionDescriptionBtn.textContent =
    elements.inputElement.textContent;

  const sectionDescription =
    elements.sectionDescriptionBtn.textContent ===
    PLACEHOLDERS.SECTION_DESCRIPTION
      ? null
      : elements.sectionDescriptionBtn.textContent;

  appStateUi.sectionObject.description = sectionDescription;

  const isSectionDes =
    elements.sectionDescriptionBtn.textContent.trim() !==
    PLACEHOLDERS.SECTION_DESCRIPTION;

  if (isSectionDes) {
    elements.sectionDescriptionBtn.classList.add("bold-section-des");
  } else {
    elements.sectionDescriptionBtn.classList.remove("bold-section-des");
  }

  elements.enterSectionNameBtn.style.display = "none";
  appStateUi.lastClickedEl = elements.enterSectionNameBtn;
  elements.sectionDescriptionBtn.style.display = "block";
  elements.enterSectionNameBtn.after(elements.inputElement);

  virtualKeyboard.caretManeger.text = elements.enterSectionNameBtn.textContent;
  virtualKeyboard.caretManeger.caretPosition =
    elements.enterSectionNameBtn.textContent.length;

  renderTextEditor();

  if (elements.inputElement.textContent === PLACEHOLDERS.SECTION_NAME) {
    renderPlaceholder();
  }

  toggleKeyboard();
  virtualKeyboard.updateAutoCaps();
};

export { moveFocusOnDescription, moveFocusOnSectionName };
