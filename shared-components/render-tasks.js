import { getCachedElements } from "./get-cached-element.js";

export const activeUlId = {
  ul: "default",
};

const createdAt = (task) => {
  let now = Date.now();
  let createdAt = task.createdAt;
  const msDifference = now - createdAt;

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
    <li class="task__date"><span>${createdAt(task)} on ${formatExactDate(task.createdAt)}</span></li>
      <li class="task__edit pd cursor hover" data-id="${task.id}">
      <button data-id="${task.id}" class="task__edit-action button-reset fs cursor" aria-label="Edit your task"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
      </li>
      <li class="task__duplication pd cursor hover" data-id="${task.id}">
      <button data-id="${task.id}" class="task__duplication-action button-reset fs cursor" aria-label="duplicate your task"><i class="fa-solid fa-copy"></i> Duplicate</button>
      </li>
      <li class="task__hide-completed-subtask fs pd cursor hover"><button data-id="${task.id}" class="task__hide-completed-action button-reset fs cursor" aria-label="mark your task as completed"><i class="fa-solid fa-eye-slash"></i> Hide completed subtasks</button>
      </li>
      <li class="task__activity-log pd fs cursor hover"><button data-id="${task.id}" class="task__activity-log-action button-reset fs cursor" aria-label="see your recent acitvity (deleting, editing , completing them and so on)"><i class="fa-solid fa-clock-rotate-left"></i> Activity log</button>
      </li>
      <li class="task__delete fs pd cursor hover" data-id="${task.id}"><button data-id="${task.id}" class="task__delete-action button-reset fs cursor" aria-label="delete your task"><i class="fa-solid fa-trash"></i> Delete task</button>
      </li>
  `;
  return moreOptions;
};

const createToolbar = (task) => {
  const toolbar = `
    <div class="close-toolbar"></div>
    <ul class="task__toolbar-actions b-radius bg box-shodow pd animate-position">
    <li class="task__edit-page">
      <button
    class="task__cancel-editing button-reset fs pd"
    aria-label="cancel editing"
  >
    < Edit task
  </button>
  <button
    class="task__save-edited-task pd fs button-reset"
    aria-label="save edited task"
    disabled
  >
    Save
  </button>
    </li>
              <li class="task__inbox flex-space-between">
    <button class="task__inbox-btn button-reset cursor fs hover" aria-label="close inbox"><i class="fa-solid fa-inbox"></i> inbox > </button>
    <button class="task__more-options button-reset cursor fs hover" aria-label="click to see more options"><i class="fa-solid fa-ellipsis-vertical"></i>
    </button>
      <ul class="task__manu animate-position pd box-shodow b-radius bg">${createMoreOptions(task)}</ul>
    </li>
      <li class="task__toolbar-list-item flex pd">
          
    <input type="checkbox" data-id="${task.id}" class="task__toolbar-task-checkbox check-layout">
    <p class="task__toolbar-task-text word-wrap">${task.text}</p>
      <button class="task__toolbar-important button-reset cursor"><i class="fa-regular fa-star"></i></button>
    </li>
    <li class="task__toolbar--description">
      <p class="task__toolbar-description-text word-wrap color">${task.description ? task.description : ""}</p>
    </li>
    <li class="task__date pd">
    <input type="date">
    </li>
    <li class="task__other-actions">
    <ul class="task__other-actions-list flex overflow">
    <li class="task__toolbar-deadline cursor hover"><button class="task__deadline button-reset flex pd fs cursor" data-id="${task.id}" aria-label="specify a deadline for your task"><i class="fa-solid fa-calendar-days"></i> Deadline</button>
    </li>
    <li class="task__toolbar-priority cursor hover"><button class="task__toolbar-priority-action button-reset flex fs pd cursor" aria-label="specify your task priority" data-id="${task.id}"><i class="fa-solid fa-flag"></i> Priority</button>
    </li>
    <li class="task__toolbar-label cursor hover"><button class="task__toolbar-label-action button-reset flex fs pd cursor" data-id="${task.id}" aria-label="label your task"><i class="fa-solid fa-tag"></i> Label</button>
    </li>
    <li class="task__toolbar-reminder cursor hover"><button class="task__toolbar-reminder-action button-reset flex fs pd cursor" aria-label="Set a reminder on your task" data-id="${task.id}"><i class="fa-solid fa-bell"></i> Reminder</button>
    </li>
    <li class="task__toolbar-location cursor hover"><button class="task__toolbar-location-action button-reset flex fs pd cursor" aria-label="specify your task location" data-id="${task.id}"><i class="fa-solid fa-location-dot"></i> Location</button>
    </li>
    <li class="task__toolbar-description cursor hover" data-id="${task.id}"><button class="task__toolbar-description-action button-reset flex fs pd cursor" aria-label="write your task a description" data-id="${task.id}"><i class="fa-solid fa-align-left"></i> Description</button>
    </li>
    <li class="task__toolbar-move-to cursor hover"><button class="task__toolbar-move-to-action button-reset flex fs pd cursor" aria-label="move your task to the other categories" data-id="${task.id}"><i class="fa-solid fa-arrows-up-down-left-right"></i> Move to</button>
    </li>
    </ul>
    </li>
    <li class="task__toolbar-subtask pd cursor hover"><button class="task__toolbar-subtask-action button-reset fs cursor" aria-label="add a subtask" data-id="${task.id}">+  add sub-task</button>
    </li>
    <li class="task__toolbar-comment flex-space-between bg-grey radius pd">
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
    .list[data-id="${activeUlId.ul}"]`);
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
    <li class="task" data-id="${eachTask.id}">
    <ul class="task__container">
    <li class="task__item flex-space-between">
    <div class="group-input-and-text flex">
    <input type="checkbox" data-id="${eachTask.id}" class="task__main-task-checkbox check-layout">
    <div class="task__wrap-task-and-description">
    <p class="task__text word-wrap">${eachTask.text}</p>
    <p class="task__description color word-wrap">${task.description ? task.description : ""}</p>
    </div>
    </div>
    <button class="task__important button-reset cursor"><i class="fa-regular fa-star"></i></button>
    </li>
    <li class="task__toolbar bg">${createToolbar(eachTask)}
    </li>
    </ul>
    </li>
    `;
  listContainer.insertAdjacentHTML("afterbegin", list);
};
