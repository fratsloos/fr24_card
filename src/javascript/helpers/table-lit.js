import { LitElement, html, css } from "lit";
import { map } from "lit/directives/map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import availableColumns from "../config/columns.json";

class Table extends LitElement {
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
        });
      });

      // Push cells to row
      aircraftRows.push(cells);

      // Update iterator
      i++;

      // Check for limit
      if (Number.isInteger(this.config.limit) && this.config.limit === i) {
        break;
      }
    }

    // Return the table with the data
    return html`<table>
      <thead>
        <!-- Column headers -->
        <tr>
          ${map(
            headerCells,
            (headerCell) => html`<th>${headerCell.value}</th>`
          )}
        </tr>

        <!-- Units -->
        ${unitCells.length > 0
          ? html`<tr>
              ${map(unitCells, (unitCell) => html`<td>${unitCell.value}</td>`)}
            </tr>`
          : ""}
      </thead>
      <tbody>
        <!-- Aircrafts -->
        ${map(
          aircraftRows,
          (aircraftCells) => html`<tr>
            ${map(
              aircraftCells,
              (aircraftCell) => html`<td>
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

      table tr th {
        background-color: var(--primary-color);
        color: var(--app-header-text-color, white);
      }

      table tr td img {
        width: 20px;
      }

      table thead tr td {
        background-color: var(--secondary-background-color);
      }

      table tbody tr:nth-child(even) {
        background-color: var(--primary-background-color);
      }
    `;
  }
}

customElements.define("fr24-table", Table);
