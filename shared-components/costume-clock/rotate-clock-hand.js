import {
  ACTIVE,
  ATTR,
  ATTR_STATES,
  CHECK_STATES,
  HIDDEN,
} from "../../constants/todo-constants.js";
import {
  appStateUi,
  elements,
} from "../../todos-controller.js/todos-controller.js";
import { getCachedElements } from "../get-cached-element.js";
import { clockInfo } from "./render-clock.js";

const getAngleFromClick = (clientX, clientY) => {
  const rect = elements.clockFace.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
  let angleDeg = angleRad * (180 / Math.PI) + 90;
  if (angleDeg < 0) angleDeg += 360;

  return angleDeg;
};

const getNearestMinute = (angleDeg) => {
  const DEGREES_PER_MINUTE = 360 / clockInfo.MINUTES_ON_CLOCK;
  let minute =
    Math.round(angleDeg / DEGREES_PER_MINUTE) % clockInfo.MINUTES_ON_CLOCK;
  return minute;
};

const getNearestHour = (angleDeg) => {
  const DEGREES_PER_HOUR = 360 / clockInfo.HOURS_ON_CLOCK;
  let hour = Math.round(angleDeg / DEGREES_PER_HOUR) % clockInfo.HOURS_ON_CLOCK;
  if (hour === 0) hour = clockInfo.HOURS_ON_CLOCK;
  return hour;
};

const resetMinuteSelection = () => {
  document
    .querySelectorAll(`[${CHECK_STATES.TIME_MINUTE}]`)
    .forEach((minuteEl) => {
      const minute = Number(minuteEl.dataset.minute);

      delete minuteEl.dataset[ATTR_STATES.SELECTED_MINUTE];

      if (minute % clockInfo.VISIBLE_MINUTE_STEP !== 0) {
        minuteEl.dataset[ATTR_STATES.CLOCK_MINUTES] = HIDDEN.CLOCK_MINUTES;
      }
    });
};

const showSpecificMinute = (minute) => {
  resetMinuteSelection();

  const minuteEl = document.querySelector(
    `[${CHECK_STATES.TIME_MINUTE}][data-minute="${minute}"]`,
  );
  if (!minuteEl) return;

  minuteEl.textContent = minute.toString().padStart(2, "0");
  minuteEl.dataset[ATTR_STATES.SELECTED_MINUTE] = "";
};

const rotateHourHand = (clientX, clientY) => {
  const isHourActive =
    elements.timeHoursEl.dataset[ATTR_STATES.TIME_HOURS] === ACTIVE.TIME_HOURS;

  if (!isHourActive) return;
  const angle = getAngleFromClick(clientX, clientY);
  const clockHand = document.querySelector(`[${ATTR.CLOCK_HAND}]`);
  if (!clockHand) return;

  const hour = getNearestHour(angle);
  appStateUi.currentHour = hour;
  const hourAngle =
    (hour % clockInfo.HOURS_ON_CLOCK) * (360 / clockInfo.HOURS_ON_CLOCK);
  clockHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
  elements.timeHoursEl.textContent = hour.toString().padStart(2, "0");

  document.querySelectorAll(`[${CHECK_STATES.TIME_HOUR}]`).forEach((el) => {
    delete el.dataset[ATTR_STATES.SELECTED_HOUR];
    if (parseInt(el.dataset.hour) === hour) {
      el.dataset[ATTR_STATES.SELECTED_HOUR] = "";
    }
  });
};

const rotateMinuteHand = (clientX, clientY) => {
  const isMinuteActive =
    elements.timeMinutesEl.dataset[ATTR_STATES.TIME_MINUTES] ===
    ACTIVE.TIME_MINUTES;

  if (!isMinuteActive) return;
  const angle = getAngleFromClick(clientX, clientY);
  const minute = getNearestMinute(angle);
  appStateUi.currentMinute = minute;
  const clockHand = document.querySelector(`[${ATTR.CLOCK_HAND}]`);
  const minuteAngle = minute * (360 / clockInfo.MINUTES_ON_CLOCK);
  clockHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
  elements.timeMinutesEl.textContent = minute.toString().padStart(2, "0");

  showSpecificMinute(minute);
};

export {
  rotateHourHand,
  rotateMinuteHand,
  resetMinuteSelection,
  showSpecificMinute,
};
