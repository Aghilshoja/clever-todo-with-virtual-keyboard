import { getCachedElements } from "./get-cached-element.js";
import { getCompletedListContainer } from "./complete-mode.js";
import {
  ACTIONS,
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  CLOSED,
  HIDDEN,
} from "../constants/todo-constants.js";

export const activeUlId = {
  ul: "default",
};

const createdAt = (task) => {
  let now = Date.now();
  let createdOrCompletedAt = task.createdAt || task.completedAt;
  const msDifference = now - createdOrCompletedAt;

  const days = msDifference / 86400000;
  const roundDays = Math.floor(days);

  const getDaysRemainder = msDifference % 86400000;
  const hours = Math.floor(getDaysRemainder / 3600000);

  const getHoursRemainder = msDifference % 3600000;
  const minutes = Math.floor(getHoursRemainder / 60000);

  let timeAgo = "";

  // Choose which time unit to display based on the elapsed time
  if (roundDays >= 1) {
    timeAgo =
      roundDays === 1
        ? `added ${roundDays} day ago`
        : `added ${roundDays} days ago`;
  } else if (hours >= 1) {
    timeAgo =
      hours === 1 ? `added ${hours} hour ago` : `added ${hours} hours ago`;
  } else if (minutes >= 1) {
    timeAgo =
      minutes === 1
        ? `added ${minutes} minute ago`
        : `added ${minutes} minutes ago`;
  } else {
    timeAgo = "just added";
  }

  return timeAgo;
};

const formatExactDate = (timestamp) => {
  return new Date(timestamp).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const createMoreOptions = (task) => {
  const moreOptions = `
    <li class="task__date"><span>${task.isCompleted ? `${createdAt(task)} on ${formatExactDate(task.completedAt)}` : `${createdAt(task)} on ${formatExactDate(task.createdAt)}`}</span></li>
      <li class="task__edit" data-id="${task.id}">
      <button data-id="${task.id}" class="task__edit-action button-reset fs cursor hover" aria-label="Edit your task" ${ACTIONS.EDIT}><i class="fa-solid fa-pen-to-square"></i> Edit</button>
      </li>
      <li class="task__duplication" data-id="${task.id}">
      <button data-id="${task.id}" class="task__duplication-action button-reset fs cursor hover" aria-label="duplicate your task" ${ACTIONS.DUPLICATE}><i class="fa-solid fa-copy"></i> Duplicate</button>
      </li>
      <li class="task__hide-completed-subtask fs"><button data-id="${task.id}" class="task__hide-completed-action button-reset fs cursor hover" aria-label="mark your task as completed"><i class="fa-solid fa-eye-slash"></i> Hide completed subtasks</button>
      </li>
      <li class="task__activity-log fs"><button data-id="${task.id}" class="task__activity-log-action button-reset fs cursor hover" aria-label="see your recent acitvity (deleting, editing , completing them and so on)" ${ACTIONS.ACTIVITY_LOG}><i class="fa-solid fa-clock-rotate-left"></i> Activity log</button>
      </li>
      <li class="task__delete fs" data-id="${task.id}"><button data-id="${task.id}" class="task__delete-action button-reset fs cursor hover" aria-label="delete your task" ${ACTIONS.DELETE}><i class="fa-solid fa-trash"></i> Delete task</button>
      </li>
  `;
  return moreOptions;
};

const createToolbar = (task) => {
  const toolbar = `
    <div class="close-toolbar" ${ACTIONS.CLOSE_TOOLBAR}></div>
    <ul class="task__toolbar-actions b-radius bg box-shodow pd" ${ATTR.TASK_TOOLBAR} ${CHECK_STATES.TASK_TOOLBAR}='${CLOSED.TASK_TOOLBAR}'>
    <li class="task__action-buttons-container" ${ATTR.ACTION_BUTTONS_CON} ${CHECK_STATES.ACTION_BUTTONS_CONTAINER_STATE}='${HIDDEN.ACTION_BUTTONS_CON}'>
      <button
    class="task__cancel-editing button-reset fs pd"
    aria-label="cancel editing" ${ACTIONS.EXIT_EDIT}
  >
    < Edit task
  </button>
  <button
    class="task__save-edited-task pd fs button-reset"
    aria-label="save edited task" ${ACTIONS.SAVE_EDIT}
    disabled
  >
    Save
  </button>
    </li>
              <li class="task__inbox flex-space-between" ${ATTR.TASK_INBOX_CON}>
    <button class="task__inbox-btn button-reset cursor fs hover" aria-label="close inbox" ${ACTIONS.CLOSE_TOOLBAR}><i class="fa-solid fa-inbox"></i> inbox > </button>
    <button class="task__more-options button-reset cursor fs hover" aria-label="click to see more options" ${ACTIONS.OPEN_TOOLBAR_MENU}><i class="fa-solid fa-ellipsis-vertical"></i>
    </button>
      <ul class="task__manu  pd box-shodow b-radius bg" ${ATTR.TOOLBAR_MENU} ${CHECK_STATES.TOOLBAR_MENU}="${CLOSED.TASK_MENU}">${createMoreOptions(task)}</ul>
    </li>

    <li> 
    <ul class="task__toolbar-scrollable-area">
      <li class="task__toolbar-list-item flex pd">
          
    <input type="checkbox" data-id="${task.id}" class="${task.isCompleted ? `task__toolbar-completed-task-checkbox check-layout` : `task__toolbar-task-checkbox check-layout`}" ${task.isCompleted ? ACTIONS.UNCOMPLETE_TASK : ACTIONS.COMPLETE_TASK} ${task.isCompleted ? "checked" : ""}>
    <p class="task__toolbar-task-text word-wrap" ${ATTR.TASK_TEXT} data-truncate-text="${task.text}">${task.text}</p>
      <button class="task__toolbar-important button-reset cursor" aria-label='mark you task aas important' ${ACTIONS.IMPORTANT_TASK}><i class="fa-regular fa-star"></i></button>
    </li>
    <li class="task__toolbar--description">
      <p class="task__toolbar-description-text word-wrap color" ${ATTR.TASK_DESCRIPTION}  data-truncate-text="${task.description ? task.description : ""}">${task.description ? task.description : ""}</p>
    </li>
    <li class="task__date pd">
    <input type="date" ${ACTIONS.TASK_DATE}>
    </li>
    <li class="task__other-actions">
    <ul class="task__other-actions-list flex overflow" ${ATTR.OTHER_ACTIONS}>
    <li class="task__toolbar-deadline cursor hover"><button class="task__deadline button-reset flex pd fs cursor" data-id="${task.id}" aria-label="specify a deadline for your task" ${ACTIONS.DEADLINE}><i class="fa-solid fa-calendar-days"></i> Deadline</button>
    </li>
    <li class="task__toolbar-priority cursor hover"><button class="task__toolbar-priority-action button-reset flex fs pd cursor" aria-label="specify your task priority" data-id="${task.id}" ${ACTIONS.PROIORITY}><i class="fa-solid fa-flag"></i> Priority</button>
    </li>
    <li class="task__toolbar-label cursor hover"><button class="task__toolbar-label-action button-reset flex fs pd cursor" data-id="${task.id}" aria-label="label your task" ${ACTIONS.LABEL}><i class="fa-solid fa-tag"></i> Label</button>
    </li>
    <li class="task__toolbar-reminder cursor hover"><button class="task__toolbar-reminder-action button-reset flex fs pd cursor" aria-label="Set a reminder on your task" data-id="${task.id}" ${ACTIONS.TASK_REMINDER}><i class="fa-solid fa-bell"></i> Reminder</button>
    </li>
    <li class="task__toolbar-location cursor hover"><button class="task__toolbar-location-action button-reset flex fs pd cursor" aria-label="specify your task location" data-id="${task.id}" ${ACTIONS.LOCATION}><i class="fa-solid fa-location-dot"></i> Location</button>
    </li>
    <li class="task__toolbar-description cursor hover" data-id="${task.id}"><button class="task__toolbar-description-action button-reset flex fs pd cursor" aria-label="write your task a description" data-id="${task.id}" ${ACTIONS.DESCRIPTION}><i class="fa-solid fa-align-left"></i> Description</button>
    </li>
    <li class="task__toolbar-move-to cursor hover"><button class="task__toolbar-move-to-action button-reset flex fs pd cursor" aria-label="move your task to the other categories" data-id="${task.id}" ${ACTIONS.MOVE_TASK}><i class="fa-solid fa-arrows-up-down-left-right"></i> Move to</button>
    </li>
    </ul>
    </li>
    <li class="task__toolbar-subtask" ${ATTR.SUB_TASK_CON}><button class="task__toolbar-subtask-action button-reset fs cursor hover" aria-label="add a subtask" data-id="${task.id}" ${ACTIONS.SUB_TASK}>+  add sub-task</button>
    </li>
    </li> 
    </ul>
    <li class="task__toolbar-comment flex-space-between bg-grey radius pd" ${ATTR.TASK_COMMENT_CON}>
    <div class="task__toolbar-comment-action" data-id="${task.id}"  tabindex="0"
      aria-label="enter a comment in input field"
      role="textbox"
      aria-multiline="true"
      data-placeholder="Enter a comment">add a comment</div>
      <label class="cursor" for="file"><i class="fa-solid fa-paperclip"></i></label>
      <input type="file" id="file" class="task__toolbar-comment-file-input hidden" data-id="${task.id}">
    </li>
    </ul>
  `;
  return toolbar;
};

const clearListContainer = (task) => {
  const listContainer = document.querySelector(`
  [${ATTR.DEFAULT_LIST}][data-id="${activeUlId.ul}"]`);
  // since we're checking the length of the task after a task is added we check if the lenght is 1
  const isThereTask = task.length === 1;
  if (isThereTask) {
    listContainer.textContent = "";
  }
  return listContainer;
};

export const renderTasks = (task, eachTask) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");

  const listContainer = clearListContainer(task);
  if (!listContainer) return;
  if (task.length === 0 || eachTask === undefined) return;

  const list = `
    <li class="task" draggable="true" data-id="${eachTask.id}" ${ATTR.TASK_ITEM}>
    <ul class="task__container">
    <li class="task__item flex-space-between">
    <div class="group-input-and-text flex">
    <input type="checkbox" data-id="${eachTask.id}" class="task__main-task-checkbox check-layout" ${ACTIONS.COMPLETE_TASK}>
    <div class="task__wrap-task-and-description">
    <p class="task__text word-wrap" ${ATTR.MAIN_TASK_TEXT} data-truncate-text="${eachTask.text}">${eachTask.text}</p>
    <p class="task__description color word-wrap" ${ATTR.MAIN_TASK_DESCRIPTION} data-truncate-text="${eachTask.description ? eachTask.description : ""}">${eachTask.description ? eachTask.description : ""}</p>
    </div>
    </div>
    <button class="task__important button-reset cursor" aria-label="mark your active task as important" data-id="${eachTask.id}" ${ACTIONS.IMPORTANT_TASK}><i class="fa-regular fa-star"></i></button>
    </li>
    <li class="task__toolbar bg">${createToolbar(eachTask)}
    </li>
    </ul>
    </li>
    `;
  listContainer.insertAdjacentHTML("afterbegin", list);
};

export const renderCompletedTask = (eachCompletedTask) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM wasn't found");
  if (!eachCompletedTask) return;

  const completedListContainer = getCompletedListContainer();
  if (!completedListContainer) return;
  const list = `
    <li class="task" draggable="true" data-id="${eachCompletedTask.id}" ${ATTR.TASK_ITEM}>
    <ul class="task__container">
    <li class="task__item flex-space-between">
    <div class="group-input-and-text flex">
    <input type="checkbox" data-id="${eachCompletedTask.id}" class="task__completed-main-task-checkbox check-layout" ${ACTIONS.UNCOMPLETE_TASK} checked>
    <div class="task__wrap-task-and-description">
    <p class="task__text word-wrap" ${ATTR.MAIN_TASK_TEXT} data-truncate-text="${eachCompletedTask.text}">${eachCompletedTask.text}</p>
    <p class="task__description color word-wrap" ${ATTR.MAIN_TASK_DESCRIPTION} data-truncate-text="${eachCompletedTask.description ? eachCompletedTask.description : ""}">${eachCompletedTask.description ? eachCompletedTask.description : ""}</p>
    </div>
    </div>
    <button class="task__important button-reset cursor"><i class="fa-regular fa-star" aria-label="mark your completed task as important" data-id="${eachCompletedTask.id}" ${ACTIONS.IMPORTANT_TASK}></i></button>
    </li>
    <li class="task__toolbar bg">${createToolbar(eachCompletedTask)}
    </li>
    </ul>
    </li>
    `;
  completedListContainer.completedList.insertAdjacentHTML("afterbegin", list);
};
