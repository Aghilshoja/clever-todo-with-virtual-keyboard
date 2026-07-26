import {
  KEYBOARD_ACTIVE,
  KEYBOARD_OPEN,
  KEYBOARD_STATES,
} from "../constants/keyboard-constants.js";
import {
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  EDIT_MODES,
  HIDDEN,
  OPEN,
} from "../constants/todo-constants.js";
import { getCachedElements } from "../shared-components/get-cached-element.js";
import { appStateUi } from "../todos-controller.js/todos-controller.js";

export const toggleKeyboard = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");

  if (elements.keyboardSection && elements.mainPageNewTaskCon) {
    elements.keyboardSection.dataset[KEYBOARD_STATES.KEYBOARD] =
      KEYBOARD_OPEN.KEYBOARD;
    elements.mainPageNewTaskCon.dataset[ATTR_STATES.TASK_CREATOR_STATE] =
      HIDDEN.TASK_CREATOR;
  }

  const isEditMode =
    appStateUi.activeMode === EDIT_MODES.DESCRIPTION ||
    appStateUi.activeMode === EDIT_MODES.EDIT_TASK;

  if (isEditMode) return;
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
