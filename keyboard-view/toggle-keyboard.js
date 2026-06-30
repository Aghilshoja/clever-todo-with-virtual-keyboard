import {
  KEYBOARD_ACTIVE,
  KEYBOARD_OPEN,
  KEYBOARD_STATES,
} from "../constants/keyboard-constants.js";
import {
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  HIDDEN,
  OPEN,
} from "../constants/todo-constants.js";
import { getCachedElements } from "../shared-components/get-cached-element.js";

export const toggleKeyboard = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");

  if (elements.keyboardSection && elements.mainPageNewTaskCon) {
    elements.keyboardSection.dataset[KEYBOARD_STATES.KEYBOARD] =
      KEYBOARD_OPEN.KEYBOARD;
    elements.mainPageNewTaskCon.dataset[ATTR_STATES.TASK_CREATOR_STATE] =
      HIDDEN.TASK_CREATOR;
  }

  // if app is in edit mode don't allow dismiss overlay block interaction with the toolbar and hide the keyboard
  const taskToolbar = document.querySelector(
    `[${CHECK_STATES.TASK_TOOLBAR}='${OPEN.TASK_TOOLBAR}']`,
  );

  if (taskToolbar) return;
  if (elements.keyboardDismissOverlay) {
    elements.keyboardSection.addEventListener(
      "transitionend",
      (e) => {
        if (e.propertyName === "opacity" || e.propertyName === "transform")
          elements.keyboardDismissOverlay.dataset[
            KEYBOARD_STATES.OVERLAY_STATE
          ] = KEYBOARD_ACTIVE.OVERLAY;
      },
      {
        once: true,
      },
    );
  }
};
