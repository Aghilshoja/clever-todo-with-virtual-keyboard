import {
  ACTIONS,
  ATTR,
  ATTR_STATES,
  CLOSED,
  OPEN,
} from "../../constants/todo-constants.js";

const toggleSectionListVisibility = (e) => {
  const togglerBtn = e.target.closest(`[${ACTIONS.SECTION_LIST_TOGGLER}]`);
  if (!togglerBtn) return;

  const list = document.querySelector(
    `[${ATTR.SECTION_LIST}][data-id="${togglerBtn.dataset.id}"]`,
  );
  if (!list) return;

  list.hidden = !list.hidden;
  togglerBtn.innerHTML = list.hidden
    ? '<i class="fas fa-chevron-right"></i>'
    : '<i class="fas fa-chevron-down"></i>';
};

let menu = null;

const closeAnyOpenSectionMenu = () => {
  const openSectionMenu = document.querySelector(
    `[${ATTR.SECTION_MENU}][data-section-menu-state="open"]`,
  );

  if (openSectionMenu) {
    openSectionMenu.dataset[ATTR_STATES.SECTION_MENU] = CLOSED.SECTION_MENU;
  }
};

const toggleSectionMenuVisibility = (e) => {
  if (e.target.closest(`[${ACTIONS.SECTION_ELLIPSIS}]`)) {
    closeAnyOpenSectionMenu();

    const taskId = e.target.closest(`[${ACTIONS.SECTION_ELLIPSIS}]`)?.dataset
      .id;

    const sectionMenu = document.querySelector(
      `[${ATTR.SECTION_MENU}][data-id="${taskId}"]`,
    );

    if (sectionMenu)
      sectionMenu.dataset[ATTR_STATES.SECTION_MENU] = OPEN.SECTION_MENU;

    if (sectionMenu) menu = sectionMenu;
  } else if (
    menu &&
    menu.dataset[ATTR_STATES.SECTION_MENU] === OPEN.SECTION_MENU
  ) {
    menu.dataset[ATTR_STATES.SECTION_MENU] = CLOSED.SECTION_MENU;
  }
};

export { toggleSectionMenuVisibility, toggleSectionListVisibility };
