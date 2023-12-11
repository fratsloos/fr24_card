import { LitElement, html, css } from "lit";
import Aircraft from "./helpers/aircraft.js";
import Config from "./config/config.js";
import Distance from "./helpers/distance.js";
import Lang from "./helpers/lang.js";
import Path from "./helpers/path.js";
import { Table } from "./helpers/tags/table.js";
import { Warning } from "./helpers/tags/warning.js";

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
   * @param {Object} card
   */
  setConfig(card) {
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

    // Parse card config
    let config = new Config(card);

    if (!config.validate()) {
      throw new Error(config.error);
    }

    // Set config
    this.config = config.get();
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

    if (typeof this.hass.states[this.config.entity] === "undefined") {
      this._isStateUndefined = true;
      return;
    }

    const states =
      this.hass.states[this.config.entity].attributes[this.config.attribute];

    // If no distance service, disable the column
    this.config.availableColumns.distance.show = false;
    if (this.config.distance === true) {
      this.config.availableColumns.distance.show = true;
    }

    // Parse each aircraft
    states.forEach((state) => {
      let aircraft = new Aircraft(
        state,
        this.config,
        this._distance,
        this._lang
      );

      let add = true;

      // Check on old messages
      if (this.config.hide.old_messages !== false && aircraft.seen > 30) {
        add = false;
      }

      // Check on ground vehicles
      if (
        this.config.hide.ground_vehicles !== false &&
        aircraft.altitude === "ground"
      ) {
        add = false;
      }

      // Check on empty values for defined columns
      if (this.config.hide.empty.length > 0) {
        for (let i = 0; i < this.config.hide.empty.length; i++) {
          let column = this.config.hide.empty[i];

          if (aircraft[column] === null || aircraft[column] === "") {
            add = false;
            break;
          }
        }
      }

      // Add aircraft
      if (add) {
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
