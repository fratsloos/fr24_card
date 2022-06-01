# Lovelace FR24 card

A custom card for Home Assistant to list the aircraft that converts the [Dump1090](https://github.com/antirez/dump1090) output of your ADS-B/Mode S receiver.

![FR24 card example](readme/images/fr24card.png?raw=true "FR24 card example")

This card is developed and tested based on the output of `data/aircraft.json` of the [FlightRadar24 Pi24 image](https://www.flightradar24.com/build-your-own).

The FR24 card has many configuration options and supports multiple languages.

## Preparation

To use the card you need to create a sensor that reads the JSON from Dump1090. Add the following configuration to your `sensors.yaml`:

```yaml
- platform: rest
  name: FR24 Aircraft
  resource: http://dump1090-host/dump1090/data/aircraft.json
  value_template: "{{ value_json.messages }}"
  method: GET
  scan_interval: 15
  json_attributes:
    - now
    - aircraft
```

Update the `resource` in this configuration to the correct URL of your Dump1090 output. The `scan_interval` of 15 seconds is a suggestion, you can change this in any other value. But keep in mind that a lower interval results in a higher load on your Home Assistant environment.

After adding the sensor you need to restart Home Assistant. After restarting check the sensors in the Developer Tools if the sensor has data.

## Installation

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

Install using [HACS](https://hacs.xyz) (in development), or follow [these instructions](readme/installation.md).

## Add the card to your dashboard

The card can be added to your dashboard like any other card. If you do not see the card, clear the cache of your browser and try again.

The minimal configuration of the card is the enity of the sensor. Based on the sensor from the above example, the card can be added with the following configuration:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
```

## Configuration

All configuration can be added in the configuration of the card, eg:
```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
lang: nl
sort: track
```

The following configuration options are available:

| Option           | Default    | Accepted                                                            | Description                                                                                                                                                                                                                                                                                                                                                                             |
| :--------------- | :--------- | :------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attribute`      | `aircraft` | `string`                                                            | By default the card will read the aircrafts from the sensors `aircraft` attribute. If your sensor uses a different attribute, change this value to the name of your attribute.                                                                                                                                                                                                          |
| `zone`           | `null`     | Any sensor that is a zone, example `zone.home`                      | The distance between Home Assistant and the reported position of the aircraft is calculated using the position of a zone. If you don't set a `zone` the data doesn't have the distance.                                                                                                                                                                                                 |
| `sort`           | `distance` | Any column, see columns                                             | The data in the table is by default sorted omn the calculated distance, with this option you can set a different column, for example `flight`.                                                                                                                                                                                                                                          |
| `lang`           | `en`       | Any supported language, see the [lang folder](src/javascript/lang/) | Sets the display language of the data. The registered country is always in English.                                                                                                                                                                                                                                                                                                     |
| `popup`          | `false`    | `boolean`                                                           | Enables or disables the popup. The popup requires both [browser_mod](https://github.com/thomasloven/hass-browser_mod) and [card-mod](https://github.com/thomasloven/lovelace-card-mod). The popup can be opened by clicking on a row and contains more data of the aircraft, including a photo of the aircraft provided by [Planespotters.net](https://www.planespotters.net/photo/api) |
| `units`          |
| `larger_units`   |
| `units_in_table` |
| `columns`        |
| `hide`           |

## F.A.Q.

Please read our [F.A.Q.](readme/faq.md) before opening an issue.
