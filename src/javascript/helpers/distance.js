/**
 * Class to calculate the distance of an aircraft to the configured zone
 */
export default class Distance {
  constructor(zone, hass) {
    this.zone = zone;
    this._hass = hass;

    // Set coordinates
    if (zone !== null) {
      this.getCoordinatesOfZone();
    }
  }

  isSetUp = function () {
    return this.hasOwnProperty("lat") && this.hasOwnProperty("lon");
  };

  getCoordinatesOfZone = function () {
    let zone = this._hass.states[this.zone];

    if (typeof zone !== "undefined") {
      this.lat = zone.attributes["latitude"];
      this.lon = zone.attributes["longitude"];
    }
  };

  deg2rad = function (deg) {
    return deg * (Math.PI / 180);
  };

  calculate = function (lat, lon) {
    if (lat === null || lon === null) {
      return "";
    }

    let R = 6371000; // Radius of the earth in m
    let dLat = this.deg2rad(lat - this.lat); // deg2rad below
    let dLon = this.deg2rad(lon - this.lon);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(this.lat)) *
        Math.cos(this.deg2rad(this.lon)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = Math.round(R * c); // Distance in m

    return d;
  };
}
