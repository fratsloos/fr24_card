export default class Row {
  constructor() {
    this.element = document.createElement("tr");
  }

  /**
   * Adds the cells to the rom element
   *
   * @param {Array} cells Array of table cells to add to the row
   */
  addCells = function (cells = []) {
    for (let i = 0; i < cells.length; i++) {
      this.element.appendChild(cells[i].element);
    }
  };

  /**
   * Adds attributes to the HTML of the row
   *
   * @param {Object} attrs Object with the attributes of the row
   */
  addAttributes = function (attrs) {
    let keys = Object.keys(attrs);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      this.element.setAttribute(key, attrs[key]);
    }
  };
}
