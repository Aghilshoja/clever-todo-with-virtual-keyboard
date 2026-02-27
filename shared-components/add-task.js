import { getCachedElements } from "./get-cached-element.js";
import { ensurePlaceholder } from "../keyboard-view/keyboard-input-behavior.js";
import { lists } from "../todos-controller.js/todos-controller.js";
import { disableSubmitIfInputEmpty } from "../keyboard-view/keyboard-input-behavior.js";

export const addTask = () => {
  const elements = getCachedElements();
  if (!elements) throw new Error("Required DOM was not found");
  if (!elements.inputElement) return;
  const value = elements.inputElement.textContent.trim();
  if (value !== "" && value !== "Enter a task") lists.default.addTask(value);
  elements.inputElement.textContent = "";
  ensurePlaceholder(elements.inputElement);
  disableSubmitIfInputEmpty();
};
