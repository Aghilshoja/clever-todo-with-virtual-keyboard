import { getCachedElements } from "../shared-components/get-cached-element.js";

export const toggleKeyboard = (e) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");
  if (e.target.classList.contains("main-page__add-task"))
    e.target.classList.add("main-page__add-task--keyboard-open");
  else {
    elements.mainPageNewTask.classList.remove(
      "main-page__add-task--keyboard-open",
    );
    e.target.classList.remove("close-keyboard");
  }
  if (
    elements.keyboardSection &&
    elements.mainPageNewTaskCon &&
    elements.keyboardDismissOverlay
  ) {
    elements.keyboardSection.classList.toggle("keyboard-section--active");
    elements.mainPageNewTaskCon.classList.toggle("toggle-visiblity");
  }

  const IsKeyboardOpen = elements.mainPageNewTask.classList.contains(
    "main-page__add-task--keyboard-open",
  );
  if (IsKeyboardOpen && elements.keyboardSection) {
    elements.keyboardSection.addEventListener(
      "transitionend",
      (e) => {
        if (e.propertyName === "opacity" || e.propertyName === "transform")
          elements.keyboardDismissOverlay.classList.add("close-keyboard");
      },
      {
        once: true,
      },
    );
  }
};
