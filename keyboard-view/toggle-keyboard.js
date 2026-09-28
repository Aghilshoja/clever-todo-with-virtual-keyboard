import {
  KEYBOARD_ACTIVE,
  KEYBOARD_OPEN,
  KEYBOARD_STATES,
} from "../constants/keyboard-constants.js";
import {
  ATTR_STATES,
  EDIT_MODES,
  HIDDEN,
} from "../constants/todo-constants.js";
import { appStateUi } from "../shared-components/todo-states/states.js";
import { elements } from "../todos-controller/todos-controller.js";

export const toggleKeyboard = () => {
  elements.keyboardSection.dataset[KEYBOARD_STATES.KEYBOARD] =
    KEYBOARD_OPEN.KEYBOARD;
  elements.mainPageNewTaskCon.dataset[ATTR_STATES.TASK_CREATOR_STATE] =
    HIDDEN.TASK_CREATOR;

  const isEditMode =
    appStateUi.activeMode === EDIT_MODES.DESCRIPTION ||
    appStateUi.activeMode === EDIT_MODES.EDIT_TASK;

  if (isEditMode) return;

  elements.keyboardSection.addEventListener(
    "transitionend",
    (e) => {
      if (e.propertyName === "opacity" || e.propertyName === "transform")
        elements.keyboardDismissOverlay.dataset[KEYBOARD_STATES.OVERLAY_STATE] =
          KEYBOARD_ACTIVE.OVERLAY;
    },
    {
      once: true,
    },
  );
};
