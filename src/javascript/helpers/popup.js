import availableColumns from "../config/columns.json";
import Provider from "./provider.js";
import { handleClick } from "custom-card-helpers";

export default class Popup {
  photo = null;

  constructor(hass, config, lang, row, aircraft) {
    this.hass = hass;
    this.config = config;
    this.lang = lang;
    this.row = row;
    this.aircraft = aircraft;

    // Open popup
    this.open();
  }

  open = function () {
    const popup = this;

    if (this.config.popup.photo && this.aircraft.hex) {
      // Get photo
      fetch(
        "https://api.planespotters.net/pub/photos/hex/" + this.aircraft.hex,
        {
          cache: "no-store",
          headers: { "Content-Type": "text/json" },
        }
      )
        .then((response) => response.text())
        .then(function (data) {
          // Parse the data
          let json = JSON.parse(data);

          if (json.photos.length > 0) {
            // Show popup with photo
            popup.photo = json.photos[0];
            popup.show();
          }
        });
    } else {
      // Show popup without photo
      this.show();
    }
  };

  show = function () {
    // Content of the popup
    let content = "";

    // Title of the airplane
    let title =
      this.aircraft.registration || this.aircraft.flight || this.aircraft.hex;

    let subtitle;
    if (this.aircraft.registration) {
      subtitle = this.aircraft.flight || this.aircraft.hex;
    } else {
      subtitle = this.aircraft.hex;
    }

    // Check if photos found
    if (this.photo !== null) {
      let image = this.photo.thumbnail_large.src;
      let link = this.photo.link;
      let photographer = this.photo.photographer;

      // Add photo to content
      content += `![${title} - &copy; ${photographer}](${image} "${title} - &copy; ${photographer}")`;
      content += `<span>&copy; [${photographer}](${link})</span>\n\n`;
    }

    // Add flag, title and icon to content
    content += "## <span>";
    if (this.aircraft.flag) {
      content += `<img src="${this.aircraft.flag}" height="15" />`;
    }
    content += `${title} - ${subtitle}</span><span>${this.aircraft.value(
      "icon",
      true
    )}</span>\n`;

    // Add table header to content
    content += `|${this.lang.popup.table.head.property}|${this.lang.popup.table.head.value}|\n|:-|-:|\n`;

    // Add data to content
    Object.keys(availableColumns).forEach((key) => {
      let column = availableColumns[key];
      let value = this.aircraft.value(key, true);

      if (column.popup && value !== "") {
        content += `|${this.lang.table.head[key]}|${value}|\n`;
      }
    });

    content += "\n";

    let provider = new Provider(this.config, this.hass);
    for (const property in this.config.providers) {
      if (this.config.providers[property]) {
        content += `* [![${property}](${provider.getImage(
          property
        )} "${property}")](${provider.getUrl(this.aircraft, property)})\n`;
      }
    }

    // Colors
    const colorPopupBackground =
      this.config.colors.popup_bg ?? "var(--card-background-color)";
    const colorPopupMarkDownText =
      this.config.colors.popup_text ??
      this.config.colors.table_text ??
      "var(--primary-color)";
    const colorPopupMarkDownLink =
      this.config.colors.popup_text ??
      this.config.colors.table_text ??
      "var(--primary-color)";
    const colorPopupTableHeadBackground =
      this.config.colors.popup_table_head_bg ??
      this.config.colors.table_head_bg ??
      "var(--primary-color)";
    const colorPopupTableHeadText =
      this.config.colors.popup_table_head_text ??
      this.config.colors.table_head_text ??
      "var(--app-header-text-color, white)";
    const colorPopupTableRowText =
      this.config.colors.popup_text ??
      this.config.colors.table_text ??
      "var(--primary-text-color)";
    const colorPopupTableRowEvenBackground =
      this.config.colors.popup_table_even_row_bg ??
      this.config.colors.table_even_row_bg ??
      "var(--primary-background-color)";
    const colorPopupTableRowEvenText =
      this.config.colors.popup_table_even_row_text ??
      this.config.colors.table_even_row_text ??
      "var(--primary-text-color)";

    // Data for the popup
    let browserModData = {
      hide_header: this.config.popup.header === false,
      style: `--mdc-theme-surface:${colorPopupBackground};`,
      content: {
        type: "markdown",
        content: content,
        card_mod: {
          style: {
            ".": `ha-card.type-markdown{border:none;}ha-markdown{background:${colorPopupBackground};}ha-markdown a{color:${colorPopupMarkDownLink}};ha-markdown.no-header{padding-top:0 !important;}`,
            "ha-markdown$": `img{width:100%}img + span{color:${colorPopupMarkDownText};font-size:10px;}img + span a{color:${colorPopupMarkDownText}}h2{display:flex;justify-content:space-between;color:${colorPopupMarkDownText};}h2 img{width:auto;height:.8em;margin:0 10px 0 0;display:inline-block;vertical-align:baseline;}table{width:100%;border-spacing:0;border-collapse:collapse;}table tr th, table tr td{padding:4px;}table tr th{background-color:${colorPopupTableHeadBackground};color:${colorPopupTableHeadText};}table tr{color:${colorPopupTableRowText};}table tr:nth-child(even){background-color:${colorPopupTableRowEvenBackground};color:${colorPopupTableRowEvenText};}ul{list-style-type:none;padding:0;display:flex;justify-content:space-between;}ul li{display:inline-block;}ul li img{height:24px;width:auto;}`,
          },
        },
      },
    };

    if (this.config.popup.header === true) {
      browserModData.title = title;
    }

    // Open popup using browser_mod
    handleClick(this.row, this.hass, {
      tap_action: {
        action: "fire-dom-event",
        browser_mod: {
          service: "browser_mod.popup",
          data: browserModData,
        },
      },
    });
  };
}
