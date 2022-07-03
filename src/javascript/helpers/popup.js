import availableColumns from "../config/columns.json";
import { handleClick } from "custom-card-helpers";

export default class Popup {
  constructor(element, hass, config, lang, aircrafts) {
    this.element = element;
    this.hass = hass;
    this.config = config;
    this.lang = lang;
    this.aircrafts = aircrafts;

    this.addEventListeners();
  }

  /**
   * Searches for the table rows in the element and adds an event listener on
   * click to open the popup
   */
  addEventListeners = function () {
    const popup = this;
    let rows = this.element.querySelectorAll("tr[data-hex]");

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];

      // Add event listener to the row
      row.addEventListener("click", function (event) {
        let cell = event.target;
        let hex = cell.parentElement
          .getAttribute("data-hex")
          .replace("aircraft-", "");

        // Search for the correct aircraft
        let aircraft = null;
        popup.aircrafts.forEach((row) => {
          if (row.hex === hex) {
            aircraft = row;
          }
        });

        // If the aircraft is found, prepare and show popup
        if (aircraft !== null) {
          fetch(
            "https://api.planespotters.net/pub/photos/hex/" + aircraft.hex,
            {
              cache: "no-store",
              headers: { "Content-Type": "text/json" },
            }
          )
            .then((response) => response.text())
            .then(function (data) {
              // Parse the data
              let json = JSON.parse(data);

              // Content of the popup
              let content = "";

              // Check if photos found
              if (json.photos.length > 0) {
                let image = json.photos[0].thumbnail_large.src;
                let link = json.photos[0].link;
                let photographer = json.photos[0].photographer;

                // Add photo to content
                content += `![Image](${image})\n`;
                content += `<font size="1">&copy; [${photographer}](${link})</font>\n\n`;
              }

              // Add flag, title and icon to content
              content += "## <span>";
              if (aircraft.flag) {
                content += `<img src="${aircraft.flag}" height="15" />`;
              }
              content += `${
                aircraft.registration || aircraft.flight || aircraft.hex
              }</span><span>${aircraft.value("icon", true)}</span>\n`;

              // Add table header to content
              content += `|${popup.lang.content.popup.table.head.property}|${popup.lang.content.popup.table.head.value}|\n|:-|-:|\n`;

              // Add data to content
              Object.keys(availableColumns).forEach((key) => {
                let column = availableColumns[key];
                let value = aircraft.value(key, true);

                if (column.popup && value !== "") {
                  content += `|${popup.lang.content.table.head[key]}|${value}|\n`;
                }
              });

              // Open popup using browser_mod
              handleClick(row, popup.hass, {
                tap_action: {
                  action: "fire-dom-event",
                  browser_mod: {
                    command: "popup",
                    hide_header: true,
                    card: {
                      type: "markdown",
                      content: content,
                      card_mod: {
                        style: {
                          ".": `ha-markdown{
                                  background:${
                                    popup.config.colors.popup_bg ??
                                    "var(--card-background-color)"
                                  };
                                }`,
                          "ha-markdown$": `font{
                                            color:${
                                              popup.config.colors.popup_text ??
                                              popup.config.colors.table_text ??
                                              "var(--primary-text-color)"
                                            };
                                          }font a{color:${
                                            popup.config.colors.popup_text ??
                                            popup.config.colors.table_text ??
                                            "var(--primary-color)"
                                          };}h2{display:flex;justify-content:space-between;color:${
                            popup.config.colors.popup_text ??
                            popup.config.colors.table_text ??
                            "var(--primary-text-color)"
                          };}h2 img{height:.8em;margin:0 10px 0 0;display:inline-block;vertical-align:baseline;}table{width:100%;border-spacing:0;border-collapse:collapse;}table tr th, table tr td{padding:4px;}table tr th{background-color:${
                            popup.config.colors.popup_table_head_bg ??
                            popup.config.colors.table_head_bg ??
                            "var(--primary-color)"
                          };color:${
                            popup.config.colors.popup_table_head_text ??
                            popup.config.colors.table_head_text ??
                            "var(--app-header-text-color, white)"
                          };}table tr{color:${
                            popup.config.colors.popup_text ??
                            popup.config.colors.table_text ??
                            "var(--primary-text-color)"
                          };}table tr:nth-child(even){background-color:${
                            popup.config.colors.popup_table_even_row_bg ??
                            popup.config.colors.table_even_row_bg ??
                            "var(--primary-background-color)"
                          };color:${
                            popup.config.colors.popup_table_even_row_text ??
                            popup.config.colors.table_even_row_text ??
                            "var(--primary-text-color)"
                          };}`,
                        },
                      },
                    },
                  },
                },
              });
            });
        }
      });
    }
  };
}
