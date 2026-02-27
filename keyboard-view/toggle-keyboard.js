import { getCachedElements } from "../shared-components/get-cached-element.js";

export const toggleKeyboard = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");
  if (elements.keyboardSection && elements.mainPageNewTaskCon)
    elements.keyboardSection.classList.toggle("keyboard-section--active");
  elements.mainPageNewTaskCon.classList.toggle("toggle-visiblity");
};
