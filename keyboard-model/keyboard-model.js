import { keyboard } from "../keyboard-view/build-keyboard-ui.js";

export class KeyboardApp {
  static EVENTS = {
    CREATE_ROWS: "createRows",
    CREATE_KEYS: "createKeys",
    CLEAR_KEYBOARD: "clearKeyboard",
    UPDATE_KEYS: "updateKeys",
  };

  constructor() {
    this.activelang = "en";
    this.capsLock = "lowercase";
    this.listeners = {
      createRows: [],
      createKeys: [],
      clearKeyboard: [],
      updateKeys: [],
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
      this.toggleLanguageLayout(this.activelayout);
    } catch (error) {
      console.error("failed to laod new keyboard layout", error);
    }
  }

  setLang(lang) {
    this.loadNewKeyboardlayout(lang);
  }

  currentCapsLock() {
    if (this.capsLock === "lowercase") this.capsLock = "cap";
    else if (this.capsLock === "cap") this.capsLock = "uppercase";
    else this.capsLock = "lowercase";

    this.emitChange(KeyboardApp.EVENTS.UPDATE_KEYS, this.capsLock);
  }

  onKeyPressed() {
    if (this.capsLock === "cap") {
      this.capsLock = "lowercase";
      this.emitChange(KeyboardApp.EVENTS.UPDATE_KEYS, this.capsLock);
    }
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
