import de from "../lang/de.json";
import en from "../lang/en.json";
import nl from "../lang/nl.json";
import sl from "../lang/sl.json";

export default class Lang {
  constructor(config, hass) {
    this.config = config;
    this.hass = hass;

    this.content = en;

    this.setLang();
  }

  setLang = function () {
    if (this.config.lang === null) {
      this.config.lang = this.hass.language;
    }

    if (this.config.lang !== "en") {
      switch (this.config.lang) {
        case "de":
          this.content = de;
          break;
        case "nl":
          this.content = nl;
          break;
        case "sl":
          this.content = sl;
          break;
      }
    }
  };
}
