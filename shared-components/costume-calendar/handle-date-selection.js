import { KEYBOARD_STATES } from "../../constants/keyboard-constants.js";
import {
  ACTIONS,
  ATTR_STATES,
  CHECK_STATES,
} from "../../constants/todo-constants.js";
import { virtualKeyboard } from "../../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../../keyboard-view/keyboard-caret-positioning.js";
import { ensureCaret } from "../../keyboard-view/keyboard-input-caret.js";
import { getCachedElements } from "../get-cached-element.js";
import { months, requiredDates } from "./create-calendar.js";
import { quickDateLabels } from "./quick-date-options.js";
import { showDateEditor } from "./prepare-date-editor.js";
import {
  enableSaveDateBtn,
  showDateSuggestion,
} from "./show-date-suggestion.js";
import {
  appStateUi,
  elements,
} from "../../todos-controller.js/todos-controller.js";

const showSelectedDate = (dayElement) => {
  const day = dayElement.dataset.day;
  const month = dayElement.dataset.month;
  const year = dayElement.dataset.year;

  requiredDates.navDate = day;

  showDateEditor();

  delete elements.inputElement.dataset[KEYBOARD_STATES.INPUT_CARET];

  const caret = ensureCaret(elements.inputElement);

  let date = null;

  const time = appStateUi.hasTime
    ? `${appStateUi.draftedDate.getHours().toString().padStart(2, "0")}:${appStateUi.draftedDate.getMinutes().toString().padStart(2, "0")}`
    : "";

  if (Number(year) === requiredDates.refYear) {
    date = `${months[month]} ${day} ${time}`;
    virtualKeyboard.caretManeger.text = date.trim();
    virtualKeyboard.caretManeger.caretPosition = date.length;
    updateTextEditor(elements.inputElement, caret);
  } else {
    date = `${months[month]} ${day} ${year} ${time}`;
    virtualKeyboard.caretManeger.text = date.trim();
    virtualKeyboard.caretManeger.caretPosition = date.length;
    updateTextEditor(elements.inputElement, caret);
  }
};

export const selectDate = (e) => {
  if (!e.target.closest(`[${ACTIONS.SELECT_WEEK_DAY}]`)) return;

  const dayBtn = e.target;
  const selectedDay = document.querySelector(
    `[${CHECK_STATES.SELECTED_WEEK_DAY}]`,
  );
  if (selectedDay) delete selectedDay.dataset[ATTR_STATES.SELECTED_WEEK_DAY];

  dayBtn.dataset[ATTR_STATES.SELECTED_WEEK_DAY] = "";
  showSelectedDate(dayBtn);
  showDateSuggestion();
  enableSaveDateBtn();
};
