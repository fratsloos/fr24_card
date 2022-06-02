import availableColumns from "../config/columns.json";

export default class Popup {
  constructor(element, hass, lang, aircrafts) {
    this.element = element;
    this.hass = hass;
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

              // Add flag and title to content
              content += "## ";
              if (aircraft.flag) {
                content += `<img src="${aircraft.flag}"/>`;
              }
              content += `${
                aircraft.registration || aircraft.flight || aircraft.hex
              }\n`;

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
              popup.hass.callService("browser_mod", "popup", {
                hide_header: true,
                card: {
                  type: "markdown",
                  content: content,
                  card_mod: {
                    style: {
                      "ha-markdown$":
                        "h2 img{height:.8em;margin: 0 10px 0 0; display:inline-block;vertical-align:baseline;}table {width: 100%;border-spacing: 0;border-collapse: collapse;}table tr th, table tr td {padding: 4px;}table tr th {background-color: var(--primary-color);color: var(--app-header-text-color, white);}table tr:nth-child(even) {background-color: var(--primary-background-color);}",
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
