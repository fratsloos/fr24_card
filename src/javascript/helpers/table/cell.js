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
}
