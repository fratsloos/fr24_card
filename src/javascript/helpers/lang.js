import en from "../lang/en.json";
import nl from "../lang/nl.json";

export default class Lang {
  constructor(lang) {
    this.lang = lang;
    this.content = en;

    this.setLang();
  }

  setLang = function () {
    if (this.lang !== "en") {
      switch (this.lang) {
        case "nl":
          this.content = nl;
          break;
      }
    }
  };
}
