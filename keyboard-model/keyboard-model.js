export class KeyboardApp {
  static EVENTS = {
    CREATE_ROWS: "createRows",
    CREATE_KEYS: "createKeys",
    CLEAR_KEYBOARD: "clearKeyboard",
  };

  constructor() {
    this.currentPreviewKey = null;
    this.clients = { clientX: null, clientY: null };
    this.previewFeedbackTimer = null;
    this.dragStartTimer = null;
    this.currentPreviewKey = null;
    this.indexs = {
      rowIndex: null,
      btnIndex: null,
    };
    this.listeners = {
      createRows: [],
      createKeys: [],
      clearKeyboard: [],
    };
  }

  subscribe(eventType, listener) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].push(listener);
    }
  }

  emitChange(eventType, ...args) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach((rowsListener) =>
        rowsListener(...args),
      );
    }
  }

  toggleLanguageLayout(langs) {
    if (!langs) throw new Error("The language wasn't found");
    this.emitChange(KeyboardApp.EVENTS.CLEAR_KEYBOARD);
    langs.rows.forEach((row, rowIndex) => {
      this.emitChange(KeyboardApp.EVENTS.CREATE_ROWS, rowIndex);
      row.forEach((key, colIndex) => {
        this.emitChange(
          KeyboardApp.EVENTS.CREATE_KEYS,
          key,
          langs,
          colIndex,
          rowIndex,
        );
      });
    });
  }
}
