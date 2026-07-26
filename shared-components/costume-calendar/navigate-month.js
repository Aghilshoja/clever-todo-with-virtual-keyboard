import { requiredDates, createCalendar } from "./create-calendar.js";

export const decrementYearAndMonth = () => {
  const START_FROM_LAST = 11;
  if (requiredDates.navMonth === 0) {
    requiredDates.navMonth = START_FROM_LAST;
    requiredDates.navYear--;
  } else {
    requiredDates.navMonth--;
  }
  createCalendar(requiredDates);
};

export const incrementYearAndMonth = () => {
  const START_FROM_START = 0;
  if (requiredDates.navMonth === 11) {
    requiredDates.navMonth = START_FROM_START;
    requiredDates.navYear++;
  } else {
    requiredDates.navMonth++;
  }
  createCalendar(requiredDates);
};
