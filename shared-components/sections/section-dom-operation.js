import { ATTR } from "../../constants/todo-constants.js";
import { appStateUi } from "../todo-states/states.js";

const createSection = () => {
  const sectionName = appStateUi.sectionObject.sectionName ?? "";
  const sectionId = appStateUi.sectionObject.id;
  const sectionDescription = appStateUi.sectionObject.description ?? "";

  const section = `
    <section class="section-item" data-id="${sectionId}" ${ATTR.SECTION_ITEM}>
      <div class="section-item__bar">
        <header class="section-item__head">
          <button
            class="section-item__name button-reset fs word-wrap"
            data-id="${sectionId}"
            data-action="edit-section-name"
            data-truncate-text="${sectionName}"
          >${sectionName}</button>
          ${
            sectionDescription
              ? `<button
                  class="section-item__description button-reset fs word-wrap"
                  data-id="${sectionId}"
                  data-action="edit-section-description"
                  data-truncate-text="${sectionDescription}"
                >${sectionDescription}</button>`
              : ""
          }
        </header>
        <div class="section-item__actions">
          <div class="section-item__menu-wrapper">
            <button
              class="section-item__more button-reset fs"
              data-id="${sectionId}"
              data-action="more-section-options"
              aria-label="more options"
              title="more options"
            ><i class="fas fa-ellipsis"></i></button>
            <ul
              class="section-item__menu"
              data-id="${sectionId}"
              role="menu"
              data-section-menu-state="closed"
              data-section-menu
            >
              <li><button class="section-item__menu-item button-reset fs" data-action="add-task-to-section" aria-label="add a task to section list" title="add a task to section list" data-id="${sectionId}">Add task</button></li>
              <li><button class="section-item__menu-item button-reset fs" data-action="edit-section" aria-label="edit section" title="edit section" data-id="${sectionId}">Edit section</button></li>
              <li><button class="section-item__menu-item button-reset fs" data-action="move-section" aria-label="move section to another list" title="move section to another list" data-id="${sectionId}">Move section</button></li>
              <li><button class="section-item__menu-item button-reset fs" data-action="duplicate-section" aria-label="duplicate section" title="duplicate section" data-id="${sectionId}">Duplicate section</button></li>
              <li><button class="section-item__menu-item button-reset fs" data-action="delete-section" aria-label="delete section" title="delete section" data-id="${sectionId}">Delete section</button></li>
            </ul>
          </div>
          <button class="button-reset" data-id="${sectionId}" data-action="data-section-list-toggler"><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
      <ul class="section-item__tasks" data-id="${sectionId}" data-section-list hidden></ul>
    </section>
  `;

  const template = document.createElement("div");
  template.innerHTML = section;
  return template.firstElementChild;
};

export { createSection };
