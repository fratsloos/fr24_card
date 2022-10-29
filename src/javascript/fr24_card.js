import { LitElement, html, css } from "lit";
import { objectMerge } from "deep-merge-object";
import Aircraft from "./helpers/aircraft.js";
import availableColumns from "./config/columns.json";
import Distance from "./helpers/distance.js";
import Lang from "./helpers/lang.js";
import Path from "./helpers/path.js";
import Table from "./helpers/tags/table.js";
import Warning from "./helpers/tags/warning.js";

// Add card to the custom cards
window.customCards = window.customCards || [];
window.customCards.push({
  type: "fr24-card",
  name: "Flight Radar card",
  description: "Card that shows the tracked flights",
  preview: false,
});

window.fr24db = [];

class FR24Card extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  /**
   * Renders the content of the card
   *
   * @returns html
   */
  render() {
    // State for undefined aircrafts warning
    this._isStateUndefined = false;

    // Distance service
    this._distance = new Distance(this.config, this.hass);

    // Set lang
    this._lang = new Lang(this.config, this.hass);

    if (this.config.entity) {
      // Parse aircrafts
      this._parseAircrafts();

      // Check for warning
      let warning = null;
      if (this._isStateUndefined) {
        warning = this._lang.content.table.data.undefined;
      } else if (this._aircrafts.length < 1) {
        warning = this._lang.content.table.data.none;
      }

      if (warning !== null) {
        // Show warning
        return html`
          <ha-card header="${this.config.title}">
            <div class="card-content">
              <fr24-warning
                .config="${this.config}"
                .message="${warning}"
              ></fr24-warning>
            </div>
          </ha-card>
        `;
      }

      return html`
        <ha-card header="${this.config.title}">
          <div class="card-content">
            <fr24-table
              .config="${this.config}"
              .hass="${this.hass}"
              .lang="${this._lang.content}"
              .aircrafts="${this._aircrafts}"
            ></fr24-table>
          </div>
        </ha-card>
      `;
    }
    return html`<ha-card>Entity <b>not</b> set</ha-card>`;
  }

  /**
   * Merges the default config with the config from the front-end and checks if
   * the config is valid
   *
   * @param {Object} config
   */
  setConfig(config) {
    // Set path
    const path = new Path();
    this._path = path.getPath();

    // Load aircraft database
    if (window.fr24db.length === 0) {
      const script = document.createElement("script");
      script.setAttribute("async", "");
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", this._path + "fr24_database.js");
      document.head.appendChild(script);
    }

    // Available columns
    this._availableColumns = availableColumns;

    // Merge config with the default config
    let defaultConfig = {
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
      colors: {
        table_head_bg: null,
        table_head_text: null,

        table_units_bg: null,
        table_units_text: null,

        table_text: null,

        table_even_row_bg: null,
        table_even_row_text: null,

        popup_bg: null,
        popup_text: null,

        popup_table_head_bg: null,
        popup_table_head_text: null,

        popup_table_even_row_bg: null,
        popup_table_even_row_text: null,
      },
    };

    config = objectMerge(defaultConfig, config);

    // Check for entity
    if (!config.entity) {
      throw new Error("You need to define and entity");
    } else if (!["default", "metric"].includes(config.units)) {
      throw new Error("Unit '" + config.units + "' not supported");
    } else if (!["asc", "desc"].includes(config.order)) {
      throw new Error("Order '" + config.order + "' not supported");
    }

    let totalWeight = 0;
    config.columns.forEach((column) => {
      if (!this._availableColumns.hasOwnProperty(column)) {
        throw new Error("Column '" + column + "' does not exist");
      }

      totalWeight += this._availableColumns[column].weight;
    });

    if (totalWeight > 15) {
      throw new Error("Too many columns defined");
    }

    // Set config
    this.config = config;
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
    return Number.isInteger(this.config.limit) ? this.config.limit + 5 : 100;
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
   * Parses the data from the entity in an array with Aircraft objects
   */
  _parseAircrafts() {
    const fr24 = this;
    this._aircrafts = [];
    const states =
      this.hass.states[this.config.entity].attributes[this.config.attribute];

    if (typeof states === "undefined") {
      this._isStateUndefined = true;
      return;
    }

    // If no distance service, disable the column
    this._availableColumns.distance.show = true;
    if (this._distance.isSetUp() === false) {
      this._availableColumns.distance.show = false;
    }

    // Parse each aircraft
    states.forEach((state) => {
      let aircraft = new Aircraft(
        state,
        this.config,
        this._distance,
        this._lang
      );
      let addToAircrafts = true;

      if (this.config.hide.old_messages !== false && aircraft.seen > 30) {
        addToAircrafts = false;
      } else if (this.config.hide.empty.length > 0) {
        for (let i = 0; i < this.config.hide.empty.length; i++) {
          let column = this.config.hide.empty[i];
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

    if (this._aircrafts.length > 1) {
      // Sort aircrafts
      this._aircrafts.sort(function (a, b) {
        // Column to sort by
        let column = fr24.config.sort || "altitude";

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

      if (this.config.order === "desc") {
        this._aircrafts = this._aircrafts.reverse();
      }
    }
  }
}

customElements.define("fr24-card", FR24Card);
