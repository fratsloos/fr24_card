export default class Provider {
  urlFlightAware = "https://flightaware.com/live/modes/%hex%/redirect";
  urlFlightRadar24 = "https://www.flightradar24.com/%flight%";

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
      // case 'adsbexchange':
      //     url = this.
      //     break;
      case "flight_aware":
        url = this.urlFlightAware;
        break;
      case "flight_radar_24":
        url = this.urlFlightRadar24;
        break;
      // case 'opensky_network':
      //     url = this.
      //     break;
      // case 'planefinder':
      //     url = this.
      //     break;
    }

    if (url !== null) {
      url = url
        .replace("%hex%", aircraft.hex)
        .replace("%flight%", aircraft.flight);
    }

    return url;
  };
}
