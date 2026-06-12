import {
  KEYBOARD_CLOSED,
  KEYBOARD_INACTIVE,
  KEYBOARD_STATES,
} from "../constants/keyboard-constants.js";
import { ATTR_STATES, HIDDEN, OPEN } from "../constants/todo-constants.js";
import { getCachedElements } from "../shared-components/get-cached-element.js";

export const closeKeyboard = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");
  if (elements.keyboardSection && elements.mainPageNewTaskCon) {
    elements.keyboardSection.dataset[KEYBOARD_STATES.KEYBOARD] =
      KEYBOARD_CLOSED.KEYBOARD;
    elements.mainPageNewTaskCon.dataset[ATTR_STATES.TASK_CREATOR_STATE] =
      OPEN.TASK_CREATOR;

    elements.keyboardDismissOverlay.dataset[KEYBOARD_STATES.OVERLAY_STATE] =
      KEYBOARD_INACTIVE.OVERLAY;
  }
};
