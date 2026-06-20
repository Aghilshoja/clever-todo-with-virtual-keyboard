import { KeyboardStructure } from "../keyboard-view/keyboard-data-structure.js";

export class KeyboardApp {
  static EVENTS = {
    CREATE_ROWS: "createRows",
    CREATE_KEYS: "createKeys",
    CLEAR_KEYBOARD: "clearKeyboard",
    UPDATE_KEYS: "updateKeys",
  };

  static CAPS_LOCK = {
    UPPERCASE: "uppercase",
    LOWERCASE: "lowercase",
    CAPS: "caps",
  };

  constructor() {
    this.keyboard = new KeyboardStructure();
    this.activelang = "en";
    this.capsLock = KeyboardApp.CAPS_LOCK.LOWERCASE;
    this.capsLockOnKeyboardLoad = true;
    this.localStorageDraftKey = "save-drafted-text";
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
        this.activelayout = structuredClone(
          this.keyboard.keyboardStructure[lang],
        );
      }
      this.toggleLanguageLayout(this.activelayout);
    } catch (error) {
      console.error("failed to laod new keyboard layout", error);
    }
  }

  setLang(lang) {
    this.loadNewKeyboardlayout(lang);
  }

  renderCapsLock() {
    this.emitChange(
      KeyboardApp.EVENTS.UPDATE_KEYS,
      this.capsLock,
      KeyboardApp.CAPS_LOCK,
    );
  }

  currentCapsLock() {
    const LOWERCASE = KeyboardApp.CAPS_LOCK.LOWERCASE;
    const UPPERCASE = KeyboardApp.CAPS_LOCK.UPPERCASE;
    const CAPS = KeyboardApp.CAPS_LOCK.CAPS;
    const isDraftEmpty =
      localStorage.getItem(this.localStorageDraftKey) === "Enter a task";
    if (this.capsLockOnKeyboardLoad) {
      this.capsLockOnKeyboardLoad = false;

      if (isDraftEmpty) this.capsLock = CAPS;

      this.renderCapsLock();

      return;
    } else if (this.capsLock === LOWERCASE) this.capsLock = CAPS;
    else if (this.capsLock === CAPS) this.capsLock = UPPERCASE;
    else this.capsLock = LOWERCASE;

    this.renderCapsLock();
  }

  onKeyPressed() {
    const LOWERCASE = KeyboardApp.CAPS_LOCK.LOWERCASE;
    const CAPS = KeyboardApp.CAPS_LOCK.CAPS;
    if (this.capsLock === CAPS) {
      this.capsLock = LOWERCASE;
      this.emitChange(
        KeyboardApp.EVENTS.UPDATE_KEYS,
        this.capsLock,
        KeyboardApp.CAPS_LOCK,
      );
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
          this.activelang,
        );
      });
    });
    this.saveNewLayout(this.activelayout, this.activelang);
  }
}
