import Path from "./helpers/path.js";
import Aircraft from "./helpers/aircraft.js";
import Distance from "./helpers/distance.js";
import Popup from "./helpers/popup.js";
import Lang from "./helpers/lang.js";
import Table from "./helpers/table.js";
import availableColumns from "./config/columns.json";
import "../styles/fr24_card.less";

// Add card to the custom cards
window.customCards = window.customCards || [];
window.customCards.push({
  type: "fr24-card",
  name: "Flight Radar card",
  description: "Card that shows the tracked flights",
  preview: false,
});

window.fr24db = [];

class Fr24Card extends HTMLElement {
  set hass(hass) {
    this._hass = hass;

    // Update the card
    if (!this._config) {
      // Can't assume setConfig is called before hass is set
      return;
    }

    // Distance service
    this._distance = new Distance(this._config, this._hass);

    // Set lang
    this._lang = new Lang(this._config, this._hass);

    // Parse aircrafts
    this._parseAircrafts();

    // Render content of the card
    this._renderTable();
  }

  /**
   * Parses the config of the card and merges it with the default config to
   * create one config object
   *
   * @param {Object} config Config from the card
   */
  setConfig(config) {
    // Set path
    const path = new Path();
    this._path = path.getPath();

    // Available columns
    this._availableColumns = availableColumns;

    // Default config
    const defaultConfig = {
      attribute: "aircraft",
      columns: [
        "flag",
        "registration",
        "flight",
        "altitude",
        "speed",
        "distance",
        "track",
      ],
      hide: {
        old_messages: true,
        empty: [],
      },
      lang: null,
      larger_units: false,
      limit: null,
      order: "asc",
      popup: false,
      sort: "altitude",
      track_in_text: false,
      units: "default",
      units_in_table: false,
      zone: null,
    };

    // Overwrite config
    const hideObject = {
      ...defaultConfig.hide,
      ...config.hide,
    };

    this._config = {
      ...defaultConfig,
      ...config,
    };

    this._config.hide = hideObject;

    // Check config
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }

    let totalWeight = 0;
    this._config.columns.forEach((column) => {
      if (!this._availableColumns.hasOwnProperty(column)) {
        throw new Error("Column '" + column + "' does not exist");
      }

      totalWeight += this._availableColumns[column].weight;
    });

    if (totalWeight > 15) {
      throw new Error("Too many columns defined");
    }

    if (!["default", "metric"].includes(this._config.units)) {
      throw new Error("Unit '" + this._config.units + "' not supported");
    }

    if (!["asc", "desc"].includes(this._config.order)) {
      throw new Error("Order '" + this._config.order + "' not supported");
    }

    // Make sure this only runs once
    if (!this.setupComplete) {
      // Create card
      this.card = document.createElement("ha-card");

      // Add the div for the content of the card
      this.contentDiv = document.createElement("div");
      this.contentDiv.setAttribute("class", "card-content");
      this.card.appendChild(this.contentDiv);

      // Add card to the dashboard
      this.appendChild(this.card);

      // Add stylesheet
      const stylesheet = document.createElement("link");
      stylesheet.setAttribute("type", "text/css");
      stylesheet.setAttribute("rel", "stylesheet");
      stylesheet.setAttribute("href", this._path + "fr24_card.css");
      this.card.appendChild(stylesheet);

      // Load aircraft database
      let loadAircraftdb = false;
      if (window.fr24db.length === 0) {
        loadAircraftdb = true;
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", this._path + "fr24_database.js");
        document.head.appendChild(script);
      }

      // Setup is complete
      this.setupComplete = true;
    }

    // Update header of the card
    this.card.setAttribute("header", config.title ?? "");
  }

  /**
   * Returns the height of the card
   *
   * Aim for a high value, as the length of the planes in the map can be
   * different each time.
   *
   * @returns {Integer} Height of the card
   */
  getCardSize() {
    return Number.isInteger(this._config.limit) ? this._config.limit + 5 : 100;
  }

  /**
   * Returns a stub for the default card configuration
   *
   * @returns {Object}
   */
  static getStubConfig() {
    return { entity: "sensor.fr24_aircraft" };
  }

  /**
   * Parses the data retrieved from the entity in to an usable object
   */
  _parseAircrafts() {
    const fr24 = this;
    this._aircrafts = [];
    const states =
      this._hass.states[this._config.entity].attributes[this._config.attribute];

    // If no distance service, disable the column
    this._availableColumns.distance.show = true;
    if (this._distance.isSetUp() === false) {
      this._availableColumns.distance.show = false;
    }

    // Parse each aircraft
    states.forEach((state) => {
      let aircraft = new Aircraft(
        state,
        this._config,
        this._distance,
        this._lang
      );
      let addToAircrafts = true;

      if (this._config.hide.old_messages !== false && aircraft.seen > 30) {
        addToAircrafts = false;
      } else if (this._config.hide.empty.length > 0) {
        for (let i = 0; i < this._config.hide.empty.length; i++) {
          let column = this._config.hide.empty[i];
          if (aircraft[column] === null || aircraft[column] === "") {
            addToAircrafts = false;
            break;
          }
        }
      }

      if (addToAircrafts) {
        this._aircrafts.push(aircraft);
      }
    });

    // Sort aircrafts
    this._aircrafts.sort(function (a, b) {
      // Column to sort by
      let column = fr24._config.sort || "altitude";

      // Values
      let valueA = a[column];
      let valueB = b[column];

      // Equal items sort equally
      if (valueA === valueB) {
        return 0;
      }
      // Nulls or empties sort after anything else
      else if (valueA === null || valueA === "") {
        return 1;
      } else if (valueB === null || valueB === "") {
        return -1;
      }
      // Sort ascending
      else {
        return valueA < valueB ? -1 : 1;
      }
    });

    if (this._config.order === "desc") {
      this._aircrafts = this._aircrafts.reverse();
    }
  }

  /**
   * Renders the HTML table with the aircrafts in it
   */
  _renderTable() {
    // Create a new table
    const table = new Table();
    const needsUnits = this._config.units_in_table === true;
    let hasUnits = false;

    // Header
    let headerCells = [];

    this._config.columns.forEach((key) => {
      // Get column from the available columns
      let column = this._availableColumns[key];

      // Check if column is visible
      if (column.show === false) {
        return;
      }

      // Content of the cell
      let value = this._lang.content.table.head[key] ?? "";

      // Styles of the cell
      let styles = column.styles ?? null;

      // Push header cell
      headerCells.push(table.cell(value, styles, "th"));
    });

    // Add header row
    table.row(headerCells, "thead");

    // Body
    let i = 0;
    for (let aircraft of this._aircrafts) {
      // First aircraft add units in table
      if (needsUnits && !hasUnits) {
        hasUnits = true;

        let unitCells = [];
        this._config.columns.forEach((key) => {
          // Get column from the available columns
          let column = this._availableColumns[key];

          // Check if column is visible
          if (column.show === false) {
            return;
          }

          // Content of the cell
          let value = aircraft.units[key] ?? "";

          // Styles of the cell
          let styles = column.styles ?? null;

          // Push header cell
          unitCells.push(table.cell(value, styles, "td"));
        });
        table.row(unitCells, "thead");
      }

      // Add aircraft
      let cells = [];

      this._config.columns.forEach((key) => {
        // Get column from the available columns
        let column = this._availableColumns[key];

        // Check if column is visible
        if (column.show === false) {
          return;
        }

        let cell = table.cell(aircraft.value(key), column.styles ?? null);

        // Push header cell
        cells.push(cell);
      });

      // Attributes of the row
      let attrs = [];
      if (this._config.popup) {
        attrs["data-hex"] = aircraft.hex;
      }

      // Add body row
      table.row(cells, null, attrs);

      // Update iterator
      i++;

      // Check for limit
      if (Number.isInteger(this._config.limit) && this._config.limit === i) {
        break;
      }
    }

    // Set content
    this.contentDiv.innerHTML = table.getHtml();

    // Add popup if configured
    if (this._config.popup) {
      const popup = new Popup(
        this.contentDiv,
        this._hass,
        this._lang,
        this._aircrafts
      );
    }
  }
}

customElements.define("fr24-card", Fr24Card);
