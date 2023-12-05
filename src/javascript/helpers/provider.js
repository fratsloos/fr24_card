import Path from "./path.js";
export default class Provider {
  urlAdbsExchange = "https://globe.adsbexchange.com/?icao=%hex%";
  urlFlightAware = "https://flightaware.com/live/modes/%hex%/redirect";
  urlFlightRadar24 = "https://www.flightradar24.com/%flight%";
  urlOpenskyNetwork =
    "https://opensky-network.org/aircraft-profile?icao24=%hex%";
  urlPlaneFinder = "https://planefinder.net/flight/%flight%";

  constructor(config, hass) {
    this.config = config;
    this.hass = hass;
  }

  getUrl = function (aircraft, provider) {
    if (typeof provider === "undefined") {
      provider = this.config.default_provider;
    }

    let url = null;
    switch (provider) {
      case "adsbexchange":
        url = this.urlAdbsExchange;
        break;
      case "flight_aware":
        url = this.urlFlightAware;
        break;
      case "flight_radar_24":
        url = this.urlFlightRadar24;
        break;
      case "opensky_network":
        url = this.urlOpenskyNetwork;
        break;
      case "planefinder":
        url = this.urlPlaneFinder;
        break;
    }

    if (url !== null) {
      url = url
        .replace("%hex%", aircraft.hex)
        .replace("%flight%", aircraft.flight);
    }

    return url;
  };

  getImage = function (provider) {
    const path = new Path();
    this.path = path.getPath();

    return `${this.path}images/providers/${
      this.config.inverted_logo ? "dark" : "light"
    }/${provider}.png`;
  };
}
