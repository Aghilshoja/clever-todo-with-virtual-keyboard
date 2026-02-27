export const ensureCaret = (input) => {
  let caret = input.querySelector(".caret");

  if (!caret) {
    caret = document.createElement("span");
    caret.classList.add("caret");
    input.appendChild(caret);
  }
  return caret;
};

export const deleteCharBeforeCaret = (input) => {
  const caret = input.querySelector(".caret");
  if (!caret) return;

  let node = caret.previousSibling;
  if (!node || node.nodeType !== Node.TEXT_NODE) return;

  node.textContent = node.textContent.slice(0, -1);

  if (node.textContent === "") node.remove();
};

export const hasUserText = (input) => {
  return Array.from(input.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent !== "",
  );
};
