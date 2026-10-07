import {
  KEYBOARD_STATES,
  PLACEHOLDERS,
} from "../../constants/keyboard-constants.js";
import { ACTIONS, EDIT_MODES } from "../../constants/todo-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { elements, lists } from "../../todos-controller/todos-controller.js";
import { appStateUi } from "../todo-states/states.js";
import { enterSectioFormUi } from "./section-form.js";

const buildTextEditor = (text) => {
  virtualKeyboard.caretManeger.text = text;
  virtualKeyboard.caretManeger.caretPosition = text.length;

  delete elements.inputElement.dataset[KEYBOARD_STATES.INPUT_CARET];

  const caret = ensureCaret(elements.inputElement);
  updateTextEditor(elements.inputElement, caret);
};

const editSection = (e) => {
  if (!e.target.closest(`[${ACTIONS.EDIT_SECTION}]`)) return;
  const sectionId = e.target.dataset.id;
  if (!sectionId) return;
  const sectionList = lists.default.getSectionList(sectionId);

  enterSectioFormUi();

  appStateUi.activeMode = EDIT_MODES.EDIT_SECTION;

  buildTextEditor(sectionList.sectionName);
  const descriptionEl = elements.sectionDescriptionBtn;
  if (sectionList.description) {
    descriptionEl.textContent = sectionList.description;
  } else descriptionEl.textContent = PLACEHOLDERS.SECTION_DESCRIPTION;

  appStateUi.sectionObject = sectionList;
  virtualKeyboard.updateAutoCaps();
};

export { editSection };
