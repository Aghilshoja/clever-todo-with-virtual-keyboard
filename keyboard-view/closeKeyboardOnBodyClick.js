import { getCachedElements } from "../cached-elements/get-cached-elements.js";

export const closeKeyboard = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");
  if (elements.keyboardSection && elements.mainPageNewTaskCon) {
    elements.keyboardSection.classList.remove("keyboard-section--active");
    elements.mainPageNewTaskCon.classList.remove("toggle-visiblity");
  }
};
