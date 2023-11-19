import Path from "./path.js";
import ICAO from "./icao.js";
import { formatNumber } from "custom-card-helpers";

export default class Aircraft {
  constructor(state, config, distance, lang) {
    this.config = config;
    this.lang = lang;

    const path = new Path();
    this._path = path.getPath();

    this.hex = state.hex.toUpperCase();
    this.icon = "mdi:airplane";

    // Map values from the state object
    this.flight = state.flight ?? null;
    this.squawk = state.squawk ?? null;
    this.altitude = state.altitude ?? state.alt_baro ?? null;
    this.speed = state.speed ?? state.gs ?? null;
    this.track = state.track ?? null;
    this.vert_rate = state.vert_rate ?? state.baro_rate ?? null;
    this.lat = state.lat ?? null;
    this.lon = state.lon ?? null;
    this.seen = state.seen ?? 100;
    this.aircraft_type = state.t ?? null;

    // ICAO data
    const icao = new ICAO();
    const country = icao.country.find(this.hex);

    // Set flag based on ICAO data
    this.flag =
      country !== null && country.iso_3166_1 !== null
        ? `${this._path}images/flags/${country.iso_3166_1.toLowerCase()}.svg`
        : null;
    this.country = country !== null ? country.country : null;

    // Registration, either from JSON or calculated
    const hasRegistration = typeof state.r !== "undefined" && state.r !== "";
    if (hasRegistration) {
      this.registration = state.r;
    } else {
      const registration = icao.registration.lookup(this.hex);

      // Set registration based on ICAO data
      this.registration = registration;
    }

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
    } else if (this.vert_rate > 0) {
      this.icon = "mdi:airplane-takeoff";
    }
  };

  setUnits = function () {
    switch (this.config.units) {
      case "metric":
        if (this.config.larger_units === true) {
          // Units in kilometer
          this.units = {
            altitude: "km",
            distance: "km",
            speed: "km/h",
          };
        } else {
          // Units in meter
          this.units = {
            altitude: "m",
            distance: "m",
            speed: "m/s",
          };
        }

        this.units.age = "s";
        if (this.config.track_in_text !== true) {
          this.units.track = "°";
        }
        break;

      default:
        this.units = {
          altitude: "ft",
          distance: "NM",
          speed: "kt",
          track: "°",
          age: "s",
        };

        if (this.config.track_in_text !== true) {
          this.units.track = "°";
        }
        break;
    }
  };

  /**
   * Returns the value of the aircraft property based on the requested key
   *
   * @param {String} key Key of the column to parse
   * @param {Boolean} inPopup Indicating if the value is shown in the popup, returning different data
   * @returns {String} Value of the table cell, can be HTML
   */
  value = function (key, inPopup) {
    let aircraft = this;
    let unit = this.units[key] ?? null;

    switch (key) {
      case "icon":
        let color = this.altitudeAsColor(aircraft.altitude);
        return `<font color="${color}"><ha-icon icon="${aircraft.icon}"></ha-icon></font>`;

      case "flag":
        if (aircraft.flag !== null) {
          return `<img src="${aircraft.flag}" alt="${aircraft.country}" width="20" />`;
        } else return "";

      case "icao":
        return aircraft.hex;

      case "age":
        let age = aircraft.seen ?? "";

        if (age !== "") {
          if (inPopup) {
            age += " " + unit;
          }
        }

        return age;

      case "speed":
        let speed = aircraft.speed ?? "";

        if (speed !== "") {
          switch (this.config.units) {
            case "metric":
              if (this.config.larger_units) {
                // Speed in km/h
                speed = formatNumber(Math.round(speed * 1.852));
              } else {
                // Speed in m/s
                speed = formatNumber(Math.round(speed * 0.514444444));
              }

              break;
          }

          speed = formatNumber(speed);

          if (inPopup) {
            speed += " " + unit;
          }
        }

        return speed;

      case "altitude":
        let altitude = aircraft.altitude ?? "";

        if (altitude !== "") {
          switch (this.config.units) {
            case "metric":
              if (this.config.larger_units) {
                // Altitude in km
                altitude = Math.round(((altitude * 0.3048) / 1000) * 10) / 10;
              } else {
                // Altitude in m
                altitude = Math.round(altitude * 0.3048);
              }

              break;
          }

          altitude = formatNumber(altitude);

          if (inPopup) {
            altitude += " " + unit;
          }
        }

        return altitude;

      case "track":
        let track = aircraft.track ?? "";

        if (track !== "") {
          if (this.config.track_in_text === true) {
            // Return as text
            track = this.trackAsText(track, inPopup);
          } else {
            // Return in degrees, with unit
            if (inPopup) {
              track += "" + unit;
            }
          }
        }

        return track;

      case "registration":
        return aircraft.registration === null
          ? this.lang.content.table.data.not_available
          : aircraft.registration;

      default:
        let value = aircraft[key] ?? "";

        if (value !== "" && typeof value === "number") {
          value = formatNumber(value);
        }

        if (inPopup && value !== "" && unit !== null) {
          value += " " + unit;
        }

        return value;
    }
  };

  altitudeAsColor = function (altitude) {
    let color_min = "EC5B13";
    let color_max = "EC5B13";
    let ratio = 0.5;

    if (altitude > 1000 && altitude <= 2000) {
      color_max = "EC7C13";
      ratio = (1 / (2000 - 1000)) * (altitude - 1000);
    } else if (altitude > 2000 && altitude <= 4000) {
      color_min = "EC7C13";
      color_max = "ECC813";
      ratio = (1 / (4000 - 2000)) * (altitude - 2000);
    } else if (altitude > 4000 && altitude <= 6000) {
      color_min = "ECC813";
      color_max = "BEDF13";
      ratio = (1 / (6000 - 4000)) * (altitude - 4000);
    } else if (altitude > 6000 && altitude <= 8000) {
      color_min = "BEDF13";
      color_max = "40EC44";
      ratio = (1 / (8000 - 6000)) * (altitude - 6000);
    } else if (altitude > 8000 && altitude <= 10000) {
      color_min = "40EC44";
      color_max = "11E276";
      ratio = (1 / (10000 - 8000)) * (altitude - 8000);
    } else if (altitude > 10000 && altitude <= 20000) {
      color_min = "11E276";
      color_max = "13BBDE";
      ratio = (1 / (20000 - 10000)) * (altitude - 10000);
    } else if (altitude > 20000 && altitude <= 30000) {
      color_min = "13BBDE";
      color_max = "241FEC";
      ratio = (1 / (30000 - 20000)) * (altitude - 20000);
    } else if (altitude > 30000 && altitude <= 40000) {
      color_min = "241FEC";
      color_max = "EB13EC";
      ratio = (1 / (40000 - 30000)) * (altitude - 30000);
    } else if (altitude > 40000) {
      color_min = "EB13EC";
      color_max = "EB13EC";
    }

    if (color_min === color_max) {
      return color_min;
    }

    color_min = color_min
      .match(/.{1,2}/g)
      .map((oct) => parseInt(oct, 16) * (1 - ratio));
    color_max = color_max
      .match(/.{1,2}/g)
      .map((oct) => parseInt(oct, 16) * ratio);
    let ci = [0, 1, 2].map((i) =>
      Math.min(Math.round(color_min[i] + color_max[i]), 255)
    );

    let color = ci
      .reduce((a, v) => (a << 8) + v, 0)
      .toString(16)
      .padStart(6, "0");

    return "#" + color;
  };

  /**
   * Returns the textual value of the track
   *
   * @param {Number} track Track in degrees
   * @param {Boolean} inPopup Indicating if the track is shown in the popup, returning longer text
   * @returns
   */
  trackAsText = function (track, inPopup) {
    let key = "n";

    if (track >= 11.25 && track <= 33.75) key = "nne";
    else if (track >= 33.75 && track <= 56.25) key = "ne";
    else if (track >= 56.25 && track <= 78.75) key = "ene";
    else if (track >= 78.75 && track <= 101.25) key = "e";
    else if (track >= 101.25 && track <= 123.75) key = "ese";
    else if (track >= 123.75 && track <= 146.25) key = "se";
    else if (track >= 146.25 && track <= 168.75) key = "sse";
    else if (track >= 168.75 && track <= 191.25) key = "s";
    else if (track >= 191.25 && track <= 213.75) key = "ssw";
    else if (track >= 213.75 && track <= 236.25) key = "sw";
    else if (track >= 236.25 && track <= 258.75) key = "wsw";
    else if (track >= 258.75 && track <= 281.25) key = "w";
    else if (track >= 281.25 && track <= 303.75) key = "wnw";
    else if (track >= 303.75 && track <= 326.25) key = "nw";
    else if (track >= 326.25 && track <= 348.75) key = "nnw";

    return inPopup
      ? this.lang.content.track.long[key]
      : this.lang.content.track.short[key];
  };
}
