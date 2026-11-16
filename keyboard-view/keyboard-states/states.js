import { PLACEHOLDERS } from "../../constants/keyboard-constants.js";

export const keyboardUiState = {
  currentPreviewKey: null,
  clients: {
    clientX: null,
    clientY: null,
  },
  previewFeedbackTimer: null,
  dragStartTimer: null,
  activelayout: null,
  deleteTimer: null,
  isBackspacePressed: false,
  backSpaceTimer: null,
  backspaceClient: {
    clientX: null,
    clientY: null,
  },
  holdThreshold: 800,
  pressStartTime: 0,
  indexs: {
    rowIndex: null,
    btnIndex: null,
  },
  activePlaceholder: PLACEHOLDERS.ENTER_TASK,

  kbDragState: {
    offsetX: 0,
    offsetY: 0,
    pressTimer: null,
    holdThreshold: 500,
    minVisible: 40,
    activePointerId: null,
    isDragging: false,
  },
};
