import { keyboard } from "../keyboard-view/build-keyboard-ui.js";

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
    this.activelayout = null;
    this.activelang = "en";
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

  saveNewLayout(layout, activeLang) {
    localStorage.setItem(`keyboard-${activeLang}`, JSON.stringify(layout));
  }

  loadNewKeyboardlayout(lang = this.activelang) {
    this.activelang = lang;
    try {
      const savedlayout = localStorage.getItem(`keyboard-${lang}`);

      if (savedlayout) {
        this.activelayout = JSON.parse(savedlayout);
      } else {
        this.activelayout = structuredClone(keyboard.keyboardStructure[lang]);
      }
      this.toggleLanguageLayout(this.activelayout, lang);
    } catch (error) {
      console.error("failed to laod new keyboard layout");
    }
  }

  setLang(lang) {
    this.loadNewKeyboardlayout(lang);
  }

  toggleLanguageLayout(langs) {
    if (!langs) throw new Error("The language wasn't found");
    this.activelayout = langs;
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
    this.saveNewLayout(this.activelayout, this.activelang);
  }
}
