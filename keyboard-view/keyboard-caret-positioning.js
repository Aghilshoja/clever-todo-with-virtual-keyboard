import { ensureCaret } from "./keyboard-input-caret.js";
import { getCachedElements } from "../shared-components/get-cached-element.js";

export const positionCaret = (e) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");

  const input = elements.inputElement;
  const isTherePlaceholder =
    input.textContent === "Description" ||
    input.textContent === "Edit your task" ||
    input.textContent === "Enter a task";

  if (isTherePlaceholder) return;
  const caret = ensureCaret(input);

  const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
  if (!pos) return;

  const { offsetNode, offset } = pos;

  if (offsetNode.nodeType !== Node.TEXT_NODE) return;

  // Split the text node at click position
  offsetNode.splitText(offset);

  // Insert caret between the split parts
  offsetNode.after(caret);
};
