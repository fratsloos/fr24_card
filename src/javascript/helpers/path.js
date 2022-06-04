export default class Path {
  constructor() {
    this.path = this.getPath();
  }

  /**
   * Returns the absolute path of the card
   *
   * @returns {String} Absolute path of the card
   */
  getPath = function () {
    const script = document
      .querySelector('script[src*="fr24_card.js"]')
      .getAttribute("src");
    return script.substring(0, script.lastIndexOf("/") + 1);
  };
}
