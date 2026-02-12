import { ensureCaret } from "./keyboard-input-caret.js";
import { getCachedElements } from "../cached-elements/get-cached-elements.js";

export const positionCaret = (e) => {
  const elements = getCachedElements();
  if (!elements) throw new Error("required DOM was not found");

  const input = elements.inputElement;
  if (input.dataset.hasPlaceholder === "true") return;
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
