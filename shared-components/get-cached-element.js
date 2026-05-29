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
    navigation: document.querySelector(".main-page__navigation"),
    keyboardDismissOverlay: document.querySelector(
      ".keyboard-section__dismiss-overlay",
    ),
    mainPageFlexContainer: document.querySelector(".main-page__flex-container"),
    warningPopup: document.querySelector(".warning"),
    unrelatedKeyboardOptions: document.querySelectorAll(
      ".keyboard-section__circle, .keyboard-section__repeat-task, .keyboard-section__submit-task, .keyboard-section__due-date-button, .keyboard-section__remind-me-button",
    ),
    circleEl: document.querySelector(".keyboard-section__circle"),
    taskCounter: document.querySelector(".main-page__task-counter"),
    inputCharacterLimit: document.querySelector(
      ".keyboard-section__input-character-limit",
    ),
    undoCompletion: document.querySelector(".undo-completion"),
    undoCompletedTask: document.querySelector(".undo-completed-task"),
    completionStatusLabel: document.querySelector(".completion-status-label"),
    dropDownList: document.querySelector(".main-page__drop-down-list"),
    selectedTasks: document.querySelector(".main-page__count-selected-tasks"),
    mainPageToolbar: document.querySelector(".main-page__toolbar"),
    activateToolbarButtons: document.querySelectorAll(
      ".main-page__task-date, .main-task__move-to, .main-page__task-label, .main-page__task-proiority, .main-page__other--option, .main-page__delete-tasks, .main-page__duplicate-tasks, .main-page__complete-or-uncomplete-tasks",
    ),
    mainPageMoreOptionsOfSelectedTasks: document.querySelector(
      ".main-page__more--options",
    ),
    mainPageSelectedTaskToolbarmanu: document.querySelector(
      ".main-page__toolbar-manu",
    ),
  };
  return elements;
};
