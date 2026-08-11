import { elements } from "../../todos-controller.js/todos-controller.js";
import {
  buildClockUI,
  cancelTimeSelection,
  decideTimePeriod,
  restoreClockView,
  saveTime,
  selectTimeByManulType,
  updateClockDisplay,
} from "../costume-clock/clock-controller.js";
import {
  renderHours,
  renderMinutes,
} from "../costume-clock/clock-view-mode.js";

export const registerClockListeners = () => {
  elements.addTimeBtn.addEventListener("click", buildClockUI);
  elements.timeHoursEl.addEventListener("click", renderHours);
  elements.timeMinutesEl.addEventListener("click", renderMinutes);
  elements.cancelTime.addEventListener("click", cancelTimeSelection);
  elements.clockFace.addEventListener("pointerdown", updateClockDisplay);
  elements.clockFace.addEventListener("pointermove", updateClockDisplay);
  elements.clockFace.addEventListener("pointerup", updateClockDisplay);
  document.addEventListener("click", decideTimePeriod);
  elements.keyboardBtn.addEventListener("click", selectTimeByManulType);
  elements.clockBtn.addEventListener("click", restoreClockView);
  elements.saveTimeBtn.addEventListener("click", saveTime);
};
