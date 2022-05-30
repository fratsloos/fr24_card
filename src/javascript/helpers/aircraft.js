import ICAO from "./icao.js";

export default class Aircraft {
  constructor(state, distance) {
    this.hex = state.hex.toUpperCase();
    this.icon = "mdi:airplane";

    // Map values from the state object
    this.flight = state.flight ?? null;
    this.squawk = state.squawk ?? null;
    this.altitude = state.altitude ?? null;
    this.speed = state.speed ?? null;
    this.track = state.track ?? null;
    this.vert_rate = state.vert_rate ?? null;
    this.lat = state.lat ?? null;
    this.lon = state.lon ?? null;

    // ICAO data
    const icao = new ICAO();
    const country = icao.country.find(this.hex);
    const registration = icao.registration.lookup(this.hex);

    // Set flag based on ICAO data
    this.flag =
      country !== null && country.iso_3166_1 !== null
        ? "/local/fr24card/dist/images/flags/" +
          country.iso_3166_1.toLowerCase() +
          ".svg"
        : null;
    this.country = country !== null ? country.country : null;

    // Set registration based on ICAO data
    this.registration = registration;

    // Calculate distance if distance service is setup
    this.distance = distance.isSetUp()
      ? distance.calculate(this.lat, this.lon)
      : null;

    // Set the icon of the aircraft
    this.setIcon();
  }

  /**
   * Sets the icon of the aircraft based on the current vertical rate
   */
  setIcon = function () {
    if (this.vert_rate < 0) {
      this.icon = "mdi:airplane-landing";
    } else if (this.vert_rate < 0) {
      this.icon = "mdi:airplane-takeoff";
    }
  };

  /**
   * Returns the value of the aircraft property based on the requested key
   *
   * @param {String} key Key of the column to parse
   * @param {Object} column Object with the column data
   * @returns {String} Value of the table cell, can be HTML
   */
  value = function (key, column) {
    let aircraft = this;

    switch (key) {
      case "icon":
        return `<font color="#${aircraft.hex}"><ha-icon icon="${aircraft.icon}"></ha-icon></font>`;

      case "flag":
        if (aircraft.flag !== null) {
          return `<img src="${aircraft.flag}" alt="${aircraft.country}" />`;
        } else return "";

      case "icao":
        return aircraft.hex;

      default:
        let value = aircraft[key] ?? "";

        if (value !== "" && column.hasOwnProperty("unit")) {
          value += " " + column.unit;
        }
        return value;
    }
  };
}
