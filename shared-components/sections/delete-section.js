import {
  ACTIONS,
  ACTIVE,
  ATTR,
  ATTR_STATES,
  DELETION_MODES,
  INACTIVE,
} from "../../constants/todo-constants.js";
import { elements, lists } from "../../todos-controller/todos-controller.js";
import { handleEmptyTaskStateUi } from "../delete-mode.js";
import { appStateUi } from "../todo-states/states.js";

const deleteSection = (e) => {
  const isSectionDeletion = appStateUi.deletionMode === DELETION_MODES.SECTION;
  if (e.target.closest(`[${ACTIONS.CONFIRM_DELETION}]`) && isSectionDeletion) {
    lists.default.deleteSection(appStateUi.sectionId);

    const sectionEl = document.querySelector(
      `[${ATTR.SECTION_ITEM}][data-id="${appStateUi.sectionId}"`,
    );

    if (sectionEl) sectionEl.remove();

    elements.warningPopup.dataset[ATTR_STATES.POPUP_STATE] = INACTIVE.POPUP;
    appStateUi.deletionMode = DELETION_MODES.NONE;

    handleEmptyTaskStateUi();
  }
};

const warnSectionDeletion = (e) => {
  if (!e.target.closest(`[${ACTIONS.DELETE_SECTION}]`)) return;
  const sectionId = e.target.dataset.id;
  if (!sectionId) return;

  appStateUi.sectionId = sectionId;

  const sectionNameEl = document.querySelector(
    `[${ACTIONS.EDIT_SECTION_NAME}][data-id="${sectionId}"]`,
  );

  if (!sectionNameEl) return;

  appStateUi.deletionMode = DELETION_MODES.SECTION;

  elements.warningPopup.dataset[ATTR_STATES.POPUP_STATE] = ACTIVE.POPUP;

  elements.warningMessage.innerHTML = `This will permanently delete "${sectionNameEl.textContent}" and can't be undone`;
  elements.deleteHeading.textContent = "Delete section?";
};

export { warnSectionDeletion, deleteSection };
