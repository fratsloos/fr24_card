/**
 * Class to calculate the distance of an aircraft to the configured zone
 */
export default class Distance {
  constructor(config, hass) {
    this.config = config;
    this.zone = config.zone;
    this.units = config.units;
    this.hass = hass;

    // Set coordinates
    if (this.zone !== null) {
      this.getCoordinatesOfZone();
    }
  }

  isSetUp = function () {
    return this.hasOwnProperty("lat") && this.hasOwnProperty("lon");
  };

  getCoordinatesOfZone = function () {
    let zone = this.hass.states[this.zone];

    if (typeof zone !== "undefined") {
      this.lat = zone.attributes["latitude"];
      this.lon = zone.attributes["longitude"];
    }
  };

  calculate = function (lat, lon) {
    // Check for empty or invalid coordinates
    if (lat === null || lon === null) {
      return "";
    }

    // Check for same location
    if (lat === this.lat && lon === this.lon) {
      return 0;
    }

    let R = 6371071; // Radius of the Earth in meter
    let rlat1 = this.lat * (Math.PI / 180); // Convert degrees to radians
    let rlat2 = lat * (Math.PI / 180); // Convert degrees to radians
    let difflat = rlat2 - rlat1; // Radian difference (latitudes)
    let difflon = (lon - this.lon) * (Math.PI / 180); // Radian difference (longitudes)

    let distance =
      2 *
      R *
      Math.asin(
        Math.sqrt(
          Math.sin(difflat / 2) * Math.sin(difflat / 2) +
            Math.cos(rlat1) *
              Math.cos(rlat2) *
              Math.sin(difflon / 2) *
              Math.sin(difflon / 2)
        )
      );

    // Round on the meter
    distance = Math.round(distance);

    // Convert distance to configured unit
    switch (this.units) {
      case "metric":
        if (this.config.larger_units) {
          // In km
          distance = Math.round((distance / 1000) * 10) / 10;
        }
        break;

      case "default":
        // In Nautical Miles
        distance = Math.round(distance * 0.000539956803 * 10) / 10;
        break;
    }

    // Return the distance
    return distance;
  };
}
