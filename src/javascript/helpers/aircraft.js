import ICAO from "./icao.js";

export default class Aircraft {
  constructor(state, config, distance) {
    this.config = config;
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

    // Set the units
    this.setUnits();
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

  setUnits = function () {
    switch (this.config.units) {
      case "metric":
        this.units = {
          altitude: "m",
          distance: "m",
          speed: "km/h",
          track: "°",
        };
        break;

      default:
        this.units = {
          altitude: "ft",
          distance: "NM",
          speed: "kt",
          track: "°",
        };
        break;
    }
  };

  /**
   * Returns the value of the aircraft property based on the requested key
   *
   * @param {String} key Key of the column to parse
   * @param {Boolean} withUnit Indicating if the value should be return with the unit
   * @returns {String} Value of the table cell, can be HTML
   */
  value = function (key, withUnit) {
    let aircraft = this;
    let unit = this.units[key] ?? null;

    switch (key) {
      case "icon":
        return `<font color="#${aircraft.hex}"><ha-icon icon="${aircraft.icon}"></ha-icon></font>`;

      case "flag":
        if (aircraft.flag !== null) {
          return `<img src="${aircraft.flag}" alt="${aircraft.country}" />`;
        } else return "";

      case "icao":
        return aircraft.hex;

      case "speed":
        let speed = aircraft.speed ?? "";

        if (speed !== "") {
          switch (this.config.units) {
            case "metric":
              // Speed in km/h
              speed = Math.round(speed * 1.852);
              break;
          }

          if (withUnit) {
            speed += " " + unit;
          }
        }

        return speed;

      case "altitude":
        let altitude = aircraft.altitude ?? "";

        if (altitude !== "") {
          switch (this.config.units) {
            case "metric":
              // Altitude in m
              altitude = Math.round(altitude * 0.3048);
              break;
          }

          if (withUnit) {
            altitude += " " + unit;
          }
        }

        return altitude;

      default:
        let value = aircraft[key] ?? "";

        if (withUnit && value !== "" && unit !== null) {
          if (key !== "track") {
            value += " ";
          }
          value += unit;
        }

        return value;
    }
  };
}
