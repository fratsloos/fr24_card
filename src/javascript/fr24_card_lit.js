import { LitElement, html, css } from "lit";
import { objectMerge } from "deep-merge-object";
import Aircraft from "./helpers/aircraft.js";
import availableColumns from "./config/columns.json";
import Distance from "./helpers/distance.js";
import Lang from "./helpers/lang.js";
import Path from "./helpers/path.js";
import Popup from "./helpers/popup.js";
import Table from "./helpers/table-lit.js";

// Add card to the custom cards
window.customCards = window.customCards || [];
window.customCards.push({
  type: "fr24-card-lit",
  name: "Flight Radar card (Lit)",
  description: "Card that shows the tracked flights",
  preview: false,
});

window.fr24db = [];

class FR24CardLit extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  render() {
    // Distance service
    this._distance = new Distance(this.config, this.hass);

    // Set lang
    this._lang = new Lang(this.config, this.hass);

    if (this.config.entity) {
      // Parse aircrafts
      this._parseAircrafts();

      return html`
        <fr24-card>
          <ha-card header="${this.config.title}">
            <div class="card-content">
              <fr24-table
                .config="${this.config}"
                .hass="${this.hass}"
                .aircrafts="${this._aircrafts}"
                .lang=${this._lang.content}
              ></fr24-table>
            </div>
          </ha-card>
        </fr24-card>
      `;
    }
    return html`<fr24-card>Entity <b>not</b> set</fr24-card>`;
  }

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

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    // return this.config.entities.length + 1;
    return 1000;
  }

  /**
   * Parses the data from the entity in an array with Aircraft objects
   */
  _parseAircrafts() {
    const fr24 = this;
    this._aircrafts = [];
    const states =
      this.hass.states[this.config.entity].attributes[this.config.attribute];

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
customElements.define("fr24-card-lit", FR24CardLit);