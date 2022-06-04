import en from "../lang/en.json";
import nl from "../lang/nl.json";

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
        case "nl":
          this.content = nl;
          break;
      }
    }
  };
}
