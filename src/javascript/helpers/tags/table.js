import { LitElement, html, css } from "lit";
import { map } from "lit/directives/map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import availableColumns from "../../config/columns.json";
import Popup from "../popup.js";
import Provider from "../provider.js";
import { handleClick } from "custom-card-helpers";

export class Table extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      aircrafts: { type: Array },
      lang: { type: Object },
    };
  }

  constructor() {
    super();

    this.clickService = {
      timer: undefined,
      target: undefined,
    };
  }

  render() {
    // Header
    let headerCells = [];

    this.config.columns.forEach((key) => {
      // Get column from the available columns
      let column = availableColumns[key];

      // Check if column is visible
      if (column.show === false) {
        return;
      }

      // Content of the cell
      let value = this.lang.table.head[key] ?? "";

      // Update header cells
      headerCells.push({
        value: value,
        styles: column.styles ?? [],
      });
    });

    // Unit
    let unitCells = [];
    if (this.config.units_in_table === true) {
      let aircraft = this.aircrafts[0];

      this.config.columns.forEach((key) => {
        // Get column from the available columns
        let column = availableColumns[key];

        // Check if column is visible
        if (column.show === false) {
          return;
        }

        // Content of the cell
        let value = aircraft.units[key] ?? "";

        // Update unit cells
        unitCells.push({
          value: value,
          styles: column.styles ?? [],
        });
      });
    }

    // Aircrafts
    let aircraftRows = [];
    let i = 0;
    for (let aircraft of this.aircrafts) {
      // Add aircraft
      let cells = [];

      this.config.columns.forEach((key) => {
        // Get column from the available columns
        let column = availableColumns[key];

        // Check if column is visible
        if (column.show === false) {
          return;
        }

        // Push cell
        cells.push({
          value: aircraft.value(key),
          html: column.html ?? false,
          styles: column.styles ?? [],
        });
      });

      // Attributes of the row
      let attrs = {};
      if (this.config.popup) {
        attrs.hex = aircraft.hex;
      }

      // Push cells to row
      aircraftRows.push({
        cells: cells,
        attrs: attrs,
      });

      // Update iterator
      i++;

      // Check for limit
      if (Number.isInteger(this.config.limit) && this.config.limit === i) {
        break;
      }
    }

    // Return the table with the data
    return html`<style>
        :host {
          --fr24-table-head-bg: ${this.config.colors.table_head_bg !== null
            ? this.config.colors.table_head_bg
            : "var(--primary-color)"};
        }
        :host {
          --fr24-table-head-text: ${this.config.colors.table_head_text !== null
            ? this.config.colors.table_head_text
            : "var(--app-header-text-color)"};
        }
        :host {
          --fr24-table-units-bg: ${this.config.colors.table_units_bg !== null
            ? this.config.colors.table_units_bg
            : "var(--secondary-background-color)"};
        }
        :host {
          --fr24-table-units-text: ${this.config.colors.table_units_text !==
          null
            ? this.config.colors.table_units_text
            : "var(--primary-text-color)"};
        }
        :host {
          --fr24-table-text: ${this.config.colors.table_text !== null
            ? this.config.colors.table_text
            : "var(--primary-text-color)"};
        }
        :host {
          --fr24-table-even-row-bg: ${this.config.colors.table_even_row_bg !==
          null
            ? this.config.colors.table_even_row_bg
            : "var(--primary-background-color)"};
        }
        :host {
          --fr24-table-even-row-text: ${this.config.colors
            .table_even_row_text !== null
            ? this.config.colors.table_even_row_text
            : "var(--primary-text-color)"};
        }
      </style>
      <table>
        <thead>
          <!-- Column headers -->
          <tr>
            ${map(
              headerCells,
              (headerCell) =>
                html`<th class="${headerCell.styles.join(" ")}">
                  ${headerCell.value}
                </th>`
            )}
          </tr>

          <!-- Units -->
          ${unitCells.length > 0
            ? html`<tr>
                ${map(
                  unitCells,
                  (unitCell) =>
                    html`<td class="${unitCell.styles.join(" ")}">
                      ${unitCell.value}
                    </td>`
                )}
              </tr>`
            : ""}
        </thead>
        <tbody>
          <!-- Aircrafts -->
          ${map(
            aircraftRows,
            (aircraftRow) => html`<tr
              @click="${this._handleClick}"
              data-hex="${aircraftRow.attrs.hasOwnProperty("hex")
                ? aircraftRow.attrs.hex
                : ""}"
            >
              ${map(
                aircraftRow.cells,
                (aircraftCell) => html`<td
                  class="${aircraftCell.styles.join(" ")}"
                >
                  ${aircraftCell.html
                    ? html`${unsafeHTML(aircraftCell.value)}`
                    : html`${aircraftCell.value}`}
                </td>`
              )}
            </tr>`
          )}
        </tbody>
      </table>`;
  }

  _handleClick(event) {
    this.clickService.target = event.target.closest("tr");

    if (this.clickService.timer) {
      clearTimeout(this.clickService.timer);
      this.clickService.timer = undefined;

      if (this.config.default_provider) {
        this._handleDoubleClick();
      }
    } else {
      this.clickService.timer = setTimeout(() => {
        this.clickService.timer = undefined;

        if (this.config.popup) {
          this._handleSingleClick();
        }
      }, this.config.dbl_click_speed);
    }
  }

  _handleSingleClick(event) {
    let row = this.clickService.target;

    if (row) {
      // Get hex of clicked row
      let hex = row.getAttribute("data-hex");

      // Search for the correct aircraft
      let aircraft = this.aircrafts.find((aircraft) => {
        return aircraft.hex === hex;
      });

      // Show popup if aircraft is found
      if (aircraft !== null) {
        new Popup(this.hass, this.config, this.lang, row, aircraft);
      }
    }
  }

  _handleDoubleClick(event) {
    let row = this.clickService.target;

    if (row) {
      // Get hex of clicked row
      let hex = row.getAttribute("data-hex");

      // Search for the correct aircraft
      let aircraft = this.aircrafts.find((aircraft) => {
        return aircraft.hex === hex;
      });

      let provider = new Provider(this.config, this.hass);

      handleClick(row, this.hass, {
        tap_action: {
          action: "url",
          url_path: provider.getUrl(aircraft),
        },
      });
    }
  }

  static get styles() {
    return css`
      table {
        width: 100%;
        border-spacing: 0;
        border-collapse: collapse;
      }

      table tr th,
      table tr td {
        padding: 4px;
        text-align: left;
      }

      table tr th.align-right,
      table tr td.align-right {
        text-align: right;
      }

      table tr th.width-s,
      table tr td.width-s {
        width: 20px;
      }

      table tr th {
        background-color: var(--fr24-table-head-bg);
        color: var(--fr24-table-head-text);
      }

      table tr td img {
        width: 20px;
      }

      table thead tr td {
        background-color: var(--fr24-table-units-bg);
        color: var(--fr24-table-units-text);
      }

      table tbody tr td {
        color: var(--fr24-table-text);
      }

      table tbody tr:nth-child(even) {
        background-color: var(--fr24-table-even-row-bg);
      }

      table tbody tr:nth-child(even) td {
        color: var(--fr24-table-even-row-text);
      }

      table tbody tr[data-hex]:not([data-hex=""]) {
        cursor: pointer;
      }
    `;
  }
}

customElements.define("fr24-table", Table);
