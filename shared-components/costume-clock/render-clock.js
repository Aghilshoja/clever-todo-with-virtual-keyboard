import {
  ACTIVE,
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  HIDDEN,
  INACTIVE,
  TIME_PERIODS,
  VISIBLE,
} from "../../constants/todo-constants.js";
import {
  appStateUi,
  elements,
} from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";

const clockInfo = {
  CLOCK_RADIUS: 80,
  HOURS_ON_CLOCK: 12,
  MINUTES_ON_CLOCK: 60,
  VISIBLE_MINUTE_STEP: 5,
};

const positionNumber = (element, number, totalParts) => {
  const angleDeg = (number / totalParts) * 360;
  const angleRad = (angleDeg - 90) * (Math.PI / 180);
  const x = 50 + (clockInfo.CLOCK_RADIUS / 2) * Math.cos(angleRad);
  const y = 50 + (clockInfo.CLOCK_RADIUS / 2) * Math.sin(angleRad);

  element.style.left = `${x}%`;
  element.style.top = `${y}%`;
  element.style.transform = "translate(-50%, -50%)";
};

const buildMinuteUI = () => {
  for (let i = 0; i < clockInfo.MINUTES_ON_CLOCK; i++) {
    const minuteEl = document.createElement("button");

    minuteEl.dataset.minute = i;
    minuteEl.dataset[ATTR_STATES.TIME_MINUTE] = "";
    minuteEl.classList.add("numbers", "minute-number", "button-reset", "fs");

    minuteEl.dataset[ATTR_STATES.CLOCK_MINUTES] = HIDDEN.CLOCK_MINUTES;

    minuteEl.textContent = i.toString().padStart(2, "0");

    elements.clockFace.appendChild(minuteEl);
    positionNumber(minuteEl, i, clockInfo.MINUTES_ON_CLOCK);
  }
};

const buildHourUI = () => {
  for (let i = 1; i <= clockInfo.HOURS_ON_CLOCK; i++) {
    const hourEl = document.createElement("button");
    hourEl.textContent = i;
    hourEl.classList.add("numbers", "hour-number", "button-reset", "fs");
    hourEl.dataset.hour = i;
    hourEl.dataset[ATTR_STATES.TIME_HOUR] = "";
    hourEl.dataset[ATTR_STATES.CLOCK_HOURS] = VISIBLE.CLOCK_HOURS;

    elements.clockFace.appendChild(hourEl);
    positionNumber(hourEl, i, clockInfo.HOURS_ON_CLOCK);
  }

  elements.timeHoursEl.dataset[ATTR_STATES.TIME_HOURS] = ACTIVE.TIME_HOURS;
};

const loadTimeIntoClock = (clockHand) => {
  const date = appStateUi.hasTime
    ? new Date(appStateUi.draftedDate)
    : new Date();

  let hour;

  const taskHour = date.getHours();
  const taskMinute = date.getMinutes();

  const hourAngle =
    (taskHour % clockInfo.HOURS_ON_CLOCK) * (360 / clockInfo.HOURS_ON_CLOCK);
  clockHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;

  const isPM = taskHour >= 12;

  if (isPM) {
    hour = taskHour === 12 ? 12 : taskHour - 12;

    elements.timeAMEl.dataset[ATTR_STATES.SELECTED_TIME_PERIOD] =
      TIME_PERIODS.NOT_SELECTED;

    elements.timePMEl.dataset[ATTR_STATES.SELECTED_TIME_PERIOD] =
      TIME_PERIODS.PM;
  } else {
    hour = taskHour === 0 ? 12 : taskHour;

    elements.timePMEl.dataset[ATTR_STATES.SELECTED_TIME_PERIOD] =
      TIME_PERIODS.NOT_SELECTED;

    elements.timeAMEl.dataset[ATTR_STATES.SELECTED_TIME_PERIOD] =
      TIME_PERIODS.AM;
  }

  const hourEl = document.querySelector(
    `[${CHECK_STATES.TIME_HOUR}][data-hour="${hour}"]`,
  );

  if (!hourEl) return;

  hourEl.dataset[ATTR_STATES.SELECTED_HOUR] = "";

  elements.timeHoursEl.textContent = hour.toString().padStart(2, "0");
  elements.timeMinutesEl.textContent = taskMinute.toString().padStart(2, "0");

  appStateUi.currentHour = hour;
  appStateUi.currentMinute = taskMinute;
};

const initilaizeHours = () => {
  elements.clockFace.textContent = "";

  buildHourUI();
  buildMinuteUI();

  const clockHand = document.createElement("div");
  clockHand.dataset.clockHand = "";
  clockHand.classList.add("clock-hand");
  elements.clockFace.appendChild(clockHand);

  const centerDot = document.createElement("div");
  centerDot.classList.add("at-center");
  elements.clockFace.appendChild(centerDot);

  loadTimeIntoClock(clockHand);
};

export { initilaizeHours, clockInfo };
