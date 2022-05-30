import Country from "./icao/country.js";
import Registration from "./icao/registration.js";

export default class ICAO {
  constructor() {
    this.country = new Country();
    this.registration = new Registration();
  }
}
