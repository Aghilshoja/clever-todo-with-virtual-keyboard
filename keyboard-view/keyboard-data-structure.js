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
          ["!#1", ",", "English (US)", "space", ".", "newLine"],
        ],
        specialKeys: {
          shift: {
            class: "keyboard__shift-key",
            label: "Shift key, capitalize letters",
            icon: "fa-solid fa-arrow-up",
            dataAction: "caps-lock",
          },

          backspace: {
            class: "keyboard__backspace-key",
            label: "backspace key",
            icon: "fa-solid fa-delete-left",
            dataAction: "backspace",
          },
          "!#1": {
            class: "keyboard__symbol-switcher",
            label: "Switch to symbols",
            dataAction: "switch-to-symbols",
          },
          "English (US)": {
            class: "keyboard__english-layout",
            label: "Current language English. Switch to Persian keyboard.",
            dataAction: "switch-to-fa",
          },
          space: {
            class: "keyboard__spacebar",
            label: "space key",
            dataAction: "space-bar",
          },
          newLine: {
            class: "keyboard__add-new-line",
            label: "Enter a new line",
            dataAction: "add-new-line",
            icon: "fa-solid fa-arrow-turn-down",
          },
        },
      },
      fa: {
        rows: [
          ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"],
          ["ص", "ث", "ق", "ف", "ع", "ه", "خ", "ح", "ج", "چ"],
          ["ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "پ"],
          ["shift", "ط", "ز", "ر", "د", "و", "ک", "گ", "backspace"],
          ["!#1", ",", "فارسی (Persian)", "space", ".", "newLine"],
        ],
        specialKeys: {
          shift: {
            class: "keyboard__shift-key",
            label: "Shift key, capitalize letters",
            icon: "fa-solid fa-arrow-up",
            dataAction: "caps-lock",
          },
          backspace: {
            class: "keyboard__backspace-key",
            label: "backspace key",
            icon: "fa-solid fa-delete-left",
            dataAction: "backspace",
          },
          "!#1": {
            class: "keyboard__symbol-switcher",
            label: "Switch to symbols",
            dataAction: "switch-to-symbols",
          },
          "فارسی (Persian)": {
            class: "keyboard__persian-layout",
            label: "Current language Persian. Switch to English keyboard.",
            dataAction: "switch-to-en",
          },
          space: {
            class: "keyboard__spacebar",
            label: "space key",
            dataAction: "space-bar",
          },
          newLine: {
            class: "keyboard__add-new-line",
            label: "Enter a new line",
            dataAction: "add-new-line",
            icon: "fa-solid fa-arrow-turn-down",
          },
        },
      },
      symbolsPage1: {
        rows: [
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
          ["+", "×", "÷", "=", "/", "_", "€", "£", "¥", "₩"],
          ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"],
          ["1/2", "-", "'", '"', ":", ";", "?", "backspace"],
          ["ABC", ",", "English (US)", "space", ".", "newLine"],
        ],
        specialKeys: {
          "1/2": {
            class: "keyboard__symbol-page-switcher",
            label: "Switch to page 2 of symbols",
            dataAction: "switch-first-page-symbols",
          },
          backspace: {
            class: "keyboard__backspace-key",
            label: "backspace key",
            icon: "fa-solid fa-delete-left",
            dataAction: "backspace",
          },
          ABC: {
            class: "keyboard__reverse-switcher",
            label: "switch to the English",
            dataAction: "switch-to-en",
          },
          "English (US)": {
            class: "keyboard__english-layout",
            label: "Current language English. Switch to Persian keyboard.",
            dataAction: "switch-to-en",
          },
          space: {
            class: "keyboard__spacebar",
            label: "space key",
            dataAction: "space-bar",
          },
          newLine: {
            class: "keyboard__add-new-line",
            label: "Enter a new line",
            dataAction: "add-new-line",
            icon: "fa-solid fa-arrow-turn-down",
          },
        },
      },
      symbolsPage2: {
        rows: [
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
          ["`", "~", "\\", "|", "<", ">", "{", "}", "[", "]"],
          ["°", "•", "○", "●", "□", "■", "♤", "♡", "◇", "♧"],
          ["2/2", "☆", "¤", "《", "》", "¡", "¿", "backspace"],
          ["ABC", ",", "English (US)", "space", ".", "newLine"],
        ],
        specialKeys: {
          "2/2": {
            class: "keyboard__symbol-page-switcher",
            label: "Switch to page 1 of symbols",
            dataAction: "switch-second-page-symbols",
          },
          backspace: {
            class: "keyboard__backspace-key",
            label: "backspace key",
            icon: "fa-solid fa-delete-left",
            dataAction: "backspace",
          },
          ABC: {
            class: "keyboard__reverse-switcher",
            label: "switch to the English",
            dataAction: "switch-to-en",
          },
          "English (US)": {
            class: "keyboard__english-layout",
            label: "Current language English. Switch to Persian keyboard.",
            dataAction: "switch-to-en",
          },
          space: {
            class: "keyboard__spacebar",
            label: "space key",
            dataAction: "space-bar",
          },
          newLine: {
            class: "keyboard__add-new-line",
            label: "Enter a new line",
            dataAction: "add-new-line",
            icon: "fa-solid fa-arrow-turn-down",
          },
        },
      },
    };
  }
}
