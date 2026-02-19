export class KeyboardStructure {
  constructor() {
    this.keyboardStructure = {
      isUpperCase: false,
      en: {
        rows: [
          ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
          ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
          ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
          ["shift", "z", "x", "c", "v", "b", "n", "m", "backspace"],
          ["!#1", ",", "English (US)", "space", ".", "Done"],
        ],
        specialKeys: {
          shift: {
            class: "keyboard__shift-key",
            label: "Shift key, capitalize letters",
            icon: "fa-solid fa-arrow-up",
          },

          backspace: {
            class: "keyboard__backspace-key",
            label: "backspace key",
            icon: "fa-solid fa-delete-left",
          },
          "!#1": {
            class: "keyboard__symbol-switcher",
            label: "Switch to symbols",
          },
          "English (US)": {
            class: "keyboard__english-layout",
            label: "Current language English. Switch to Persian keyboard.",
          },
          space: {
            class: "keyboard__spacebar",
            label: "space key",
          },
          Done: {
            class: "keyboard__submit-button",
            label: "Enter key, submit input",
          },
        },
      },
      fa: {
        rows: [
          ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"],
          ["ص", "ث", "ق", "ف", "ع", "ه", "خ", "ح", "ج", "ج"],
          ["ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "پ"],
          ["shift", "ط", "ز", "ر", "د", "و", "ک", "گ", "backspace"],
          ["!#1", ",", "فارسی (Persian)", "space", ".", "Done"],
        ],
        specialKeys: {
          shift: {
            class: "keyboard__shift-key",
            label: "Shift key, capitalize letters",
            icon: "fa-solid fa-arrow-up",
          },
          backspace: {
            class: "keyboard__backspace-key",
            label: "backspace key",
            icon: "fa-solid fa-delete-left",
          },
          "!#1": {
            class: "keyboard__symbol-switcher",
            label: "Switch to symbols",
          },
          "فارسی (Persian)": {
            class: "keyboard__persian-layout",
            label: "Current language Persian. Switch to English keyboard.",
          },
          space: {
            class: "keyboard__spacebar",
            label: "space key",
          },
          Done: {
            class: "keyboard__submit-button",
            label: "Enter key, submit input",
          },
        },
      },
      symbols: {
        rows: [
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
          ["+", "*", "=", "-", "_", "?", "/", "[", "]", "|"],
          ["'", ":", ";", "$", "@", ")", "(", "}", "{"],
          ["shift", "`", ">", "<", '"', "~", "&", "^", "backspace"],
          ["ABC", ",", "English (US)", "space", ".", "Done"],
        ],
        specialKeys: {
          shift: {
            class: "keyboard__shift-key",
            label: "Shift key, capitalize letters",
            icon: "fa-solid fa-arrow-up",
          },
          backspace: {
            class: "keyboard__backspace-key",
            label: "backspace key",
            icon: "fa-solid fa-delete-left",
          },
          ABC: {
            class: "keyboard__reverse-switcher",
            label: "switch to the English",
          },
          "English (US)": {
            class: "keyboard__english-layout",
            label: "Current language English. Switch to Persian keyboard.",
          },
          space: {
            class: "keyboard__spacebar",
            label: "space key",
          },
          Done: {
            class: "keyboard__submit-button",
            label: "Enter key, submit input",
          },
        },
      },
    };
  }
}
