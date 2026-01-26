export class KeyboardStructure {
  constructor() {
    this.keyboardStructure = {
      isUpperCase: false,
      en: {
        rows: [
          ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
          ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
          ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
          [" ", "z", "x", "c", "v", "b", "n", "m", "del"],
          ["!#1", ",", "English (US)", "space", ".", "Done"],
        ],
        specialKeys: {
          " ": {
            class: "fa-solid fa-arrow-up  keyboard-input-container__arrow-key",
            label: "Shift key, capitalize letters",
          },

          del: {
            class:
              "fa-solid fa-delete-left keyboard-input-container__delete-key",
            label: "backspace key",
          },
          "!#1": {
            class: "keyboard-input-container__symbol-switcher",
            label: "Switch to symbols",
          },
          "English (US)": {
            class: "keyboard-input-container__english",
            label: "Current language English. Switch to Persian keyboard.",
          },
          space: {
            class: "keyboard-input-container__space-button",
            label: "space key",
          },
          Done: {
            class: "keyboard-input-container__submit-button",
            label: "Enter key, submit input",
          },
        },
      },
      fa: {
        rows: [
          ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"],
          ["ص", "ث", "ق", "ف", "ع", "ه", "خ", "ح", "ج", "ج"],
          ["ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "پ"],
          [" ", "ط", "ز", "ر", "د", "و", "ک", "گ", ""],
          ["!#1", ",", "فارسی (Persian)", "space", ".", "Done"],
        ],
        specialKeys: {
          " ": {
            class: "fa-solid fa-arrow-up  keyboard-input-container__arrow-key",
            label: "Shift key, capitalize letters",
          },
          "": {
            class:
              "fa-solid fa-delete-left keyboard-input-container__delete-key",
            label: "backspace key",
          },
          "!#1": {
            class: "keyboard-input-container__symbol-switcher",
            label: "Switch to symbols",
          },
          "فارسی (Persian)": {
            class: "keyboard-input-container__persian",
            label: "Current language Persian. Switch to English keyboard.",
          },
          space: {
            class: "keyboard-input-container__space-button",
            label: "space key",
          },
          Done: {
            class: "keyboard-input-container__submit-button",
            label: "Enter key, submit input",
          },
        },
      },
      symbols: {
        rows: [
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
          ["+", "*", "=", "-", "_", "?", "/", "[", "]", "|"],
          ["'", ":", ";", "$", "@", ")", "(", "}", "{"],
          ["", "`", ">", "<", '"', "~", "&", "^", " "],
          ["ABC", ",", "English (US)", "space", ".", "Done"],
        ],
        specialKeys: {
          "": {
            class: "fa-solid fa-arrow-up keyboard-input-container__arrow-key",
            label: "Shift key, capitalize letters",
          },
          " ": {
            class:
              "fa-solid fa-delete-left keyboard-input-container__delete-key",
            label: "backspace key",
          },
          ABC: {
            class: "keyboard-input-container__reverse-switcher",
            label: "switch to the English",
          },
          "English (US)": { class: "keyboard-input-container__english" },
          space: {
            class: "keyboard-input-container__space-button",
            label: "space key",
          },
          Done: {
            class: "keyboaord-input-container__submit-button",
            label: "Enter key, submit input",
          },
        },
      },
    };
  }
}
