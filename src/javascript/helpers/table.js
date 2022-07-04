import Row from "./table/row";
import Cell from "./table/cell";

export default class Table {
  constructor() {
    // Create the table and the thead and tbody
    this.table = document.createElement("table");
    this.thead = document.createElement("thead");
    this.tbody = document.createElement("tbody");
    this.tfoot = document.createElement("tfoot");

    this.hasRowsInHead = false;
    this.hasRowsInBody = false;
    this.hasRowsInFoot = false;
  }

  /**
   * Returns the HTML of the table
   *
   * @returns {String} HTML string of the table
   */
  getHtml = function () {
    if (this.hasRowsInHead) {
      this.table.appendChild(this.thead);
    }

    if (this.hasRowsInBody) {
      this.table.appendChild(this.tbody);
    }

    if (this.hasRowsInFoot) {
      this.table.appendChild(this.tfoot);
    }

    return this.table.outerHTML;
  };

  /**
   * Creates a row element and appends it to the correct destination
   *
   * @param {Array} cells Array with cell to add to the table
   * @param {String} destination Destination of the table row, default: `tbody`
   * @param {Object|null} attrs HTML attributes of the row
   */
  row = function (cells = [], destination = "tbody", attrs = null) {
    let row = new Row();

    if (
      typeof attrs === "object" &&
      attrs !== null &&
      Object.keys(attrs).length > 0
    ) {
      row.addAttributes(attrs);
    }

    row.addCells(cells);

    switch (destination) {
      case "thead":
        this.thead.appendChild(row.element);
        this.hasRowsInHead = true;
        break;
      case "tfoot":
        this.tfoot.appendChild(row.element);
        this.hasRowsInFoot = true;
        break;
      case "tbody":
      default:
        this.tbody.appendChild(row.element);
        this.hasRowsInBody = true;
        break;
    }
  };

  /**
   * Creates a cell element to append to a table row
   *
   * @param {String} value Value of the table cell, can be in HTML
   * @param {Array} classes CSS classes to add to the cell
   * @param {String} element Type of element, default: `td`
   * @param {Object|null} attrs HTML attributes of the cell
   * @returns {HTMLElement} Element of the table cell
   */
  cell = function (value, classes = null, element = "td", attrs = null) {
    let cell = new Cell(element);

    cell.setValue(value);

    if (classes != null && typeof classes === "object") {
      cell.setClasses(classes);
    }

    if (
      typeof attrs === "object" &&
      attrs !== null &&
      Object.keys(attrs).length > 0
    ) {
      cell.addAttributes(attrs);
    }

    return cell;
  };
}
