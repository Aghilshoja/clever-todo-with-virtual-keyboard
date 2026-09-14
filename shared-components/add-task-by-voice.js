import {
  KEYBOARD_STATES,
  LOCAL_STORAGE_KEY,
} from "../constants/keyboard-constants.js";
import { ACTIONS, MICROPHONE_MODE } from "../constants/todo-constants.js";
import { virtualKeyboard } from "../keyboard-controler/keyboard-controler.js";
import { updateTextEditor } from "../keyboard-view/keyboard-caret-positioning.js";
import {
  disableSubmitIfInputEmpty,
  ensurePlaceholder,
} from "../keyboard-view/keyboard-input-behavior.js";
import { ensureCaret } from "../keyboard-view/keyboard-input-caret.js";
import { elements } from "../todos-controller.js/todos-controller.js";
import { saveInputText } from "./save-drafted-text-input-to-local-storage.js";
import { appStateUi } from "./todo-states/states.js";

let recognition = null;
let isListening = false;
let listenersAttached = false;
let endReason = null; // "confirm" | "abort" | "error" | null

const preserveDraftedTaskAfterVoiceRecognition = () => {
  const input = elements.inputElement;
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY.TEXT_EDITOR);
  const savedData = raw ? JSON.parse(raw) : null;
  const drafted = savedData?.draftedNewTask ?? "";

  if (drafted.length > 0) {
    const caret = ensureCaret(input);
    virtualKeyboard.caretManeger.text = drafted;
    virtualKeyboard.caretManeger.caretPosition = savedData.caretPosition;
    updateTextEditor(input, caret);
    delete input.dataset[KEYBOARD_STATES.INPUT_CARET];
  } else {
    input.textContent = "";
    ensurePlaceholder(input);
    virtualKeyboard.resetCaretState();
  }

  saveInputText();
  disableSubmitIfInputEmpty();
};

const removeVoiceActionButtons = () => {
  document.querySelector(".voice-actions-container")?.remove();
};

const resetVoiceInput = () => {
  const input = elements.inputElement;
  const isEmpty = input.textContent === "";
  const isListeningPrompt = input.textContent === MICROPHONE_MODE.MIC_PROMPT;

  if (isEmpty || isListeningPrompt) {
    virtualKeyboard.resetCaretState();
    input.textContent = "";
    ensurePlaceholder(input);
  }
};

const resetVoiceUI = () => {
  elements.speechToTextBtn.style.display = "block";
  removeVoiceActionButtons();
  resetVoiceInput();
};

const createVoiceActionButtons = (speechToTextBtn) => {
  const voiceActionButtons = document.querySelector(".voice-actions-container");
  if (voiceActionButtons) return;

  const template = document.createElement("div");
  template.innerHTML = `<div class="voice-actions-container">
    <button class="voice-btn voice-btn--confirm" aria-label="confirm voice input" title="confirm voice input" data-action="confirm-voice-input"><i class="fas fa-check"></i></button>
    <button class="voice-btn voice-btn--cancel"  aria-label="cancel voice input"  title="cancel voice input"  data-action="cancel-voice-input"><i class="fas fa-xmark"></i></button>
  </div>`;

  speechToTextBtn.before(template.firstElementChild);
};

const buildTextEditor = (text) => {
  virtualKeyboard.caretManeger.text = text;
  virtualKeyboard.caretManeger.caretPosition = text.length;
  delete elements.inputElement.dataset[KEYBOARD_STATES.INPUT_CARET];
  const caret = ensureCaret(elements.inputElement);
  updateTextEditor(elements.inputElement, caret);
};

const attachListeners = (rec) => {
  if (listenersAttached) return;
  listenersAttached = true;

  rec.addEventListener("start", () => {
    endReason = null;

    isListening = true;
    appStateUi.microphoneMode = MICROPHONE_MODE.MIC_PROMPT;
    createVoiceActionButtons(elements.speechToTextBtn);
    elements.speechToTextBtn.style.display = "none";
    buildTextEditor(MICROPHONE_MODE.MIC_PROMPT);
    disableSubmitIfInputEmpty();
  });

  rec.addEventListener("result", (event) => {
    let text = "";

    for (let i = 0; i < event.results.length; i++) {
      text += event.results[i][0].transcript + " ";
    }

    buildTextEditor(text.trim());
    disableSubmitIfInputEmpty();
    virtualKeyboard.updateAutoCaps();
  });

  rec.addEventListener("error", (event) => {
    isListening = false;
    if (event.error === "aborted") return;
    endReason = "error";

    let toastTimeout = null;

    const showTemporaryMessage = (message, type = "error") => {
      clearTimeout(toastTimeout);

      // Remove any existing toast so we never stack them
      document.querySelector(".voice-toast")?.remove();

      const toast = document.createElement("div");
      toast.className = `voice-toast voice-toast--${type}`;
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");

      toast.innerHTML = `
    <i class="fas fa-circle-exclamation voice-toast__icon"></i>
    <span class="voice-toast__message">${message}</span>
  `;

      document.body.appendChild(toast);

      requestAnimationFrame(() => toast.classList.add("voice-toast--visible"));

      toastTimeout = setTimeout(() => {
        toast.classList.remove("voice-toast--visible");
        toast.addEventListener(
          "transitionend",
          () => {
            toast.remove();
            virtualKeyboard.updateAutoCaps();
          },
          { once: true },
        );
        toastTimeout = null;
      }, 2000);
    };

    if (event.error === "not-allowed") {
      showTemporaryMessage(
        "Microphone access was denied. Enable it in your browser settings.",
        "warning",
      );

      recognition = null;
      listenersAttached = false;
    } else if (event.error === "no-speech") {
      showTemporaryMessage("No speech detected");
    } else if (event.error === "network") {
      showTemporaryMessage("There is no internet connection", "error");
    } else {
      console.error("Recognition error:", event);
      showTemporaryMessage("Something went wrong. Try again.");
    }

    isListening = false;
  });

  rec.addEventListener("end", () => {
    isListening = false;
    appStateUi.microphoneMode = null;

    switch (endReason) {
      case "confirm":
        resetVoiceUI();
        saveInputText();
        virtualKeyboard.updateAutoCaps();
        break;
      case "abort":
        preserveDraftedTaskAfterVoiceRecognition();
        resetVoiceUI();
        virtualKeyboard.updateAutoCaps();
        break;
      case "error":
        preserveDraftedTaskAfterVoiceRecognition();
        resetVoiceUI();
        break;
      default:
        resetVoiceUI();
        break;
    }

    endReason = null;
  });
};

const startListening = (rec) => {
  attachListeners(rec);

  if (isListening) return;

  isListening = true;
  try {
    rec.start();
  } catch (error) {
    console.error("Failed to start recognition:", error);
    isListening = false;
    resetVoiceUI();
  }
};

const startVoiceTaskInput = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    // show a toast here as well
    return;
  }

  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
  }

  startListening(recognition);
};

const stopVoiceRecording = (e) => {
  if (!e.target.closest(`[${ACTIONS.CONFIRM_VOICE}]`)) return;
  if (recognition && isListening) {
    endReason = "confirm"; // FIX 7: set before stop() (already was)
    recognition.stop();
  }
};

const abortVoiceRecording = (e) => {
  if (!e.target.closest(`[${ACTIONS.CANCEL_VOICE}]`)) return;
  if (!recognition) return;
  endReason = "abort";
  recognition.abort();
};

export { startVoiceTaskInput, stopVoiceRecording, abortVoiceRecording };
