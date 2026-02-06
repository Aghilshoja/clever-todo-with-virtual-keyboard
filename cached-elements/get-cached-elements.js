export const getCachedElements = () => {
  const elements = {
    splashHeader: document.querySelector(".splash-header"),
    mainPage: document.querySelector(".hidden-main-page"),
    keyboardContainer: document.querySelector(".keyboard-section__keyboard"),
    mainPageNewTask: document.querySelector(".main-page__add-task"),
    mainPageNewTaskCon: document.querySelector(".main-page__new-task"),
    keyboardSection: document.querySelector(".keyboard-section"),
    previewFeedback: document.querySelector(
      ".keyboard-section__preview-feedback",
    ),
    loeaderDot: document.querySelector(".splash-header__loader-dot"),
    inputElement: document.querySelector(".keyboard-section__task-input"),
    submitTask: document.querySelector(".keyboard-section__submit-task"),
  };
  return elements;
};
