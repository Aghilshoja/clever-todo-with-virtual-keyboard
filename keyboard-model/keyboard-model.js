export class KeyboardApp {
  static EVENTS = {
    CREATE_ROWS: "createRows",
    CREATE_KEYS: "createKeys",
  };

  constructor() {
    this.currentPreviewKey = null;
    this.clients = { clientX: null, clientY: null };
    this.previewFeedbackTimer = null;
    this.listeners = {
      createRows: [],
      createKeys: [],
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
        rowsListener(...args)
      );
    }
  }

  toggleLanguageLayout(langs) {
    if (!langs) throw new Error("The language wasn't found");
    langs.rows.forEach((rows, index) => {
      this.emitChange(KeyboardApp.EVENTS.CREATE_ROWS, rows, index);
      rows.forEach((key) => {
        this.emitChange(KeyboardApp.EVENTS.CREATE_KEYS, key, langs);
      });
    });
  }
}
