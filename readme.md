# Lovelace FR24 card

A custom card for Home Assistant to list the aircraft that converts the [Dump1090](https://github.com/antirez/dump1090) output of your ADS-B/Mode S receiver.

![FR24 card example](readme/images/fr24card.png?raw=true "FR24 card example")

This card is developed and tested based on the output of `data/aircraft.json` of the [FlightRadar24 Pi24 image](https://www.flightradar24.com/build-your-own).

The FR24 card has many configuration options and supports multiple languages.

**Contents of this file**
- [Lovelace FR24 card](#lovelace-fr24-card)
- [Preparation](#preparation)
- [Installation](#installation)
- [Add the card to your dashboard](#add-the-card-to-your-dashboard)
- [Configuration](#configuration)
  - [Columns](#columns)
  - [Hide](#hide)
- [F.A.Q.](#faq)
- [Contribute](#contribute)
- [Credits](#credits)

# Preparation

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

# Installation

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

Install using [HACS](https://hacs.xyz) (in development), or follow [these instructions](readme/installation.md).

# Add the card to your dashboard

The card can be added to your dashboard like any other card. If you do not see the card, clear the cache of your browser and try again.

The minimal configuration of the card is only the entity of the sensor. Based on the sensor from the above example, the card can be added with the following configuration:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
```

# Configuration

All configuration can be added in the configuration of the card, eg:
```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
lang: nl
sort: track
```

The following configuration options are available:

| Option           | Type      | Default                                                                        | Accepted                                                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :--------------- | :-------- | :----------------------------------------------------------------------------- | :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attribute`      | `string`  | `aircraft`                                                                     | An attribute of the sensor                                          | By default the card will read the aircrafts from the sensors `aircraft` attribute. If your sensor uses a different attribute, change this value to the name of your attribute.                                                                                                                                                                                                                                                                                                   |
| `zone`           | `string`  | `null`                                                                         | Any sensor that is a zone, example `zone.home`                      | The distance between Home Assistant and the reported position of the aircraft is calculated using the position of a zone. If you don't set a `zone` the data doesn't have the distance.                                                                                                                                                                                                                                                                                          |
| `sort`           | `string`  | `distance`                                                                     | Any column, see [columns](#columns)                                 | The data in the table is by default sorted omn the calculated distance, with this option you can set a different column, for example `flight`.                                                                                                                                                                                                                                                                                                                                   |
| `lang`           | `string`  | `en`                                                                           | Any supported language, see the [lang folder](src/javascript/lang/) | Sets the display language of the data. The registered country is always in English.                                                                                                                                                                                                                                                                                                                                                                                              |
| `popup`          | `boolean` | `false`                                                                        | `true`, `false`                                                     | Enables or disables the popup. The popup requires both [browser_mod](https://github.com/thomasloven/hass-browser_mod) and [card-mod](https://github.com/thomasloven/lovelace-card-mod). The popup can be opened by clicking on a row and contains more data of the aircraft, including a photo of the aircraft provided by [Planespotters.net](https://www.planespotters.net/photo/api).<br><br>![Example of the popup](readme/images/popup.png?raw=true "Example of the popup") |
| `units`          | `string`  | `default`                                                                      | `default`, `metric`                                                 | Sets the units for the values. The `default` units are as they are returned by Dump1090 (`ft` for altitude, `NM` for distance, `kt` for speed). When using `metric` the value and units are converted (`m` for altitude and distance, `m/s` for speed).                                                                                                                                                                                                                          |
| `larger_units`   | `boolean` | `false`                                                                        | `true`, `false`                                                     | When using `metric` units, and this option set to `true`, the units are converted to `km` for altitude and distance and `km/h` for speed.                                                                                                                                                                                                                                                                                                                                        |
| `units_in_table` | `boolean` | `false`                                                                        | `true`, `false`                                                     | When this option is set to `true`, the table header will be appended with a second row containing the units.<br><br>![Units in the table header](readme/images/units.png?raw=true "Units in the table header")                                                                                                                                                                                                                                                                   |
| `track_in_text`  | `boolean` | `false`                                                                        | `true`, `false`                                                     | By default the reported track of the aircraft is displayd in degrees `°`. With this option set to `true` the track is displayed in text.  When displayed in text, it's an abbreviation in the table and full text in the popup.                                                                                                                                                                                                                                                  |
| `columns`        | `array`   | `["flag", "registration", "flight", "altitude", "speed", "distance", "track"]` | Array with any of the columns, see [columns](#columns)              | Array containing the columns to show in the table. The data of the othet columns is available in the popup, if that is enabled. Too many columns will break your Dashboard, so the card will give a warning if too many columns are added.                                                                                                                                                                                                                                       |
| `hide`           | `object`  |                                                                                |                                                                     | Used to configure which data is hidden. See [Hide](#hide).                                                                                                                                                                                                                                                                                                                                                                                                                       |

## Columns

The card supports the following columns:

| Column         | Data                                                                                                                                          |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `icon`         | Icon for the airplane, unique colored based on the hex (`icao`) of the aircraft. Uses the vertical state of the aircraft for different icons. |
| `icao`         | ICAO code of the aircraft                                                                                                                     |
| `flag`         | Flag of the country of registration                                                                                                           |
| `country`      | Country of registration                                                                                                                       |
| `registration` | Registration code of the aircraft                                                                                                             |
| `flight`       | Flight number                                                                                                                                 |
| `squawk`       | Squawk code                                                                                                                                   |
| `altitude`     | Reported altitude                                                                                                                             |
| `speed`        | Reported speed                                                                                                                                |
| `distance`     | Calculated distance between the configured `zone` and the reported position                                                                   |
| `track`        | Reported track                                                                                                                                |
| `age`          | Age of the message                                                                                                                            |

All of the columns, except for `icon` are shown in the popup.

## Hide

With this object it's possible to set the configuration of the data that is hidden. Data must be added as an object in the yaml configuration. Example:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
hide:
  old_messages: false
```

The following keys are available in the object:

| Option         | Type      | Default | Accepted        | Description                                                                                                                                                                                          |
| :------------- | :-------- | :------ | :-------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `old_messages` | `boolean` | `true`  | `true`, `false` | By default aircraft data which is received more than 30 seconds ago will be filtered out of the card. Setting this option to `false` will show all aircraft data that is available in the JSON file. |

# F.A.Q.

Please read our [F.A.Q.](readme/faq.md) before opening an issue.
# Contribute

You can help make this card by forking this repository and merging your changes with a pull request to the `develop` branch of this repository.

This applies not only to additions and improvements to the code, but certainly also to new [languages](src/javascript/lang/).

I am particularly interested in improvements to the registration code database. For more information about the database, click [here](readme/database.md).

# Credits

Honor where credit is due. This card could not have been made without consulting the following sources:

- The aircraft registration and country data is heavily inspired on the code from [FlightAware's Dump1090](https://github.com/flightaware/dump1090);
- The popup is working thanks to the great plugins by Thomas Lovén: [browser_mod](https://github.com/thomasloven/hass-browser_mod) and [card-mod](https://github.com/thomasloven/lovelace-card-mod);
- The aircraft photos in the popup are added with the use of the [Planespotters.net API](https://www.planespotters.net/photo/api).
