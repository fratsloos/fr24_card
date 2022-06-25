# F.A.Q.

Okay, I admit it: these are not frequently asked questions (yet), but to get ahead of them, here are a few questions that I think will come up.

**Contents of this file**
- [F.A.Q.](#faq)
  - [That table is nice and all, but can you also make a map?](#that-table-is-nice-and-all-but-can-you-also-make-a-map)
  - [Why does the card take up a lot of space? | Why is there only one card in the column?](#why-does-the-card-take-up-a-lot-of-space--why-is-there-only-one-card-in-the-column)
  - [The popup doesn't work?](#the-popup-doesnt-work)
  - [The styling of the popup looks strange?](#the-styling-of-the-popup-looks-strange)
  - [If I have the popup open and the sensor is refreshed, does the data in the popup not change?](#if-i-have-the-popup-open-and-the-sensor-is-refreshed-does-the-data-in-the-popup-not-change)
  - [Why is the distance not correct?](#why-is-the-distance-not-correct)
  - [Why is the registration of the aircrafts not available on (first) load?](#why-is-the-registration-of-the-aircrafts-not-available-on-first-load)

## That table is nice and all, but can you also make a map?

This card does not support map. Maybe that will change in the future, but I'm not making any promises about this. The map card in Home Assistant works on the basis of sensors, and since this is not an integration but a Javascript module, sensors are only read, not created.

## Why does the card take up a lot of space? | Why is there only one card in the column?

The contents of the card may change each time the sensor is refreshed. After all, the number of aircraft displayed is not always the same.

To ensure that your dashboard does not jump every time the sensor is renewed, I have chosen to give the card a static height, and to make it so high that it is almost certain that no card will be placed underneath.

An exception on this is when you use the configuration option `limit`. With this option you can limit the number of results in the table, and the card will return the correct height back to Home Assistant.

## The popup doesn't work?

The popup is based on the functionalities of [browser_mod](https://github.com/thomasloven/hass-browser_mod). Install browser_mod and try again.

## The styling of the popup looks strange?

The popup styling is added using [card-mod](https://github.com/thomasloven/lovelace-card-mod). Install card-mod and try again.

## If I have the popup open and the sensor is refreshed, does the data in the popup not change?

This is a choice made when developing the card. This choice could just be different in a next version. For now, this setup is sufficient.

The data in the popup is static because the data is sent to the markdown card as a static object when the popup is opened.

This has the added benefit that when the popup is open and the plane gets out of sight of your system, the popup won't run out of data.

## Why is the distance not correct?

The distance is calculated between the coordinates of your configured zone and the position that is received from the aircraft. If you believe the distance is not correct, check if the coordinates of your zone are correct.

## Why is the registration of the aircrafts not available on (first) load?

The hex (ICAO) code of the data is matched against the data in [`fr24_database.js`](../dist/fr24_database.js). This is a large file that is side loaded when the card is loaded for the first time (in every browser session). This might cause the first render of the card to don't have the registration data. The data will be loaded next time the card is rendered (which happens when the sensor is updated).

You could try to add the database to your dashboard as Javascript module to fix this issue.
