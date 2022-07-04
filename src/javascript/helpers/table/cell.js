export default class Cell {
  constructor(element = "td") {
    // Create the element
    this.element = document.createElement(element);
  }

  /**
   * Sets the value of the table cell
   *
   * @param {String} value Value of the cell, can be HTML
   */
  setValue = function (value = "") {
    this.element.innerHTML = value;
  };

  /**
   * Adds the CSS classes to the class attribute of the cell element
   *
   * @param {Array} classes Array of CSS classes
   */
  setClasses = function (classes = []) {
    if (classes != null && typeof classes === "object") {
      this.element.setAttribute("class", classes.join(" "));
    }
  };

  /**
   * Adds attributes to the HTML of the cell
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
