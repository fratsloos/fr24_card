# Lovelace FR24 card

A custom card for Home Assistant to list the aircraft found in the [Dump1090](https://github.com/antirez/dump1090) output of your ADS-B/Mode S receiver.

![Screenshot of FR24 card in action](https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/fr24card.png?raw=true "Screenshot of FR24 card in action")

This card is developed and tested based on the output of `data/aircraft.json` of the [FlightRadar24 Pi24 image](https://www.flightradar24.com/build-your-own).

The FR24 card has many configuration options and supports multiple languages.


**Did my project help you? Then you can always thank me with a coffee!**

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/fratsloos)

---

**Contents of this file**
- [Lovelace FR24 card](#lovelace-fr24-card)
- [Preparation](#preparation)
- [Installation](#installation)
- [Add the card to your dashboard](#add-the-card-to-your-dashboard)
- [Configuration](#configuration)
  - [Colors](#colors)
  - [Columns](#columns)
  - [Hide](#hide)
    - [Hide empty values](#hide-empty-values)
- [F.A.Q.](#faq)
- [Contribute](#contribute)
- [Credits](#credits)

---

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

Update the key `resource` in this configuration to the correct URL of your Dump1090 output. The `scan_interval` of 15 seconds is a suggestion, you can change this in any other value. But keep in mind that a lower interval results in a higher load on your Home Assistant environment.

After adding the sensor you need to restart Home Assistant. After restarting, in the Developer Tools check if the sensor has data.

# Installation

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

Install using [HACS](https://hacs.xyz), or follow [these instructions](readme/installation.md).

# Add the card to your dashboard

The card can be added to your dashboard like any other card. If you do not see the card as an option, clear the cache of your browser and try again.

The minimal configuration of the card contains only the entity of the sensor. When using the sensor from the above example, the card can be added with the following configuration:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
```

# Configuration

All options can be added in the configuration of the card, eg:
```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
lang: nl
sort: track
```

The following configuration options are available:

| Option           | Type      | Default                                                                        | Accepted                                                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :--------------- | :-------- | :----------------------------------------------------------------------------- | :------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attribute`      | `string`  | `aircraft`                                                                     | An attribute of the sensor                                          | By default the card will read the aircrafts from the sensors `aircraft` attribute. If your sensor uses a different attribute, change this value to the name of your attribute.                                                                                                                                                                                                                                                                                                                                                                |
| `colors`         | `object`  |                                                                                |                                                                     | Used to overwrite the default color scheme of the card. See [Colors](#colors).                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `columns`        | `array`   | `["flag", "registration", "flight", "altitude", "speed", "distance", "track"]` | Array with any of the columns, see [columns](#columns)              | Array containing the columns to show in the table. The data of the other columns is available in the popup, if that is enabled. Too many columns will break your Dashboard, so the card will give a warning if too many columns are added.                                                                                                                                                                                                                                                                                                    |
| `hide`           | `object`  |                                                                                |                                                                     | Used to configure which data is hidden. See [Hide](#hide).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `lang`           | `string`  | `null`                                                                         | Any supported language, see the [lang folder](src/javascript/lang/) | Sets the display language of the data. By default the `hass` object of your browser will be used to set the language. If that language is not available, English will be used. The registered country is always in English.                                                                                                                                                                                                                                                                                                                   |
| `larger_units`   | `boolean` | `false`                                                                        | `true`, `false`                                                     | When using `metric` units, and this option set to `true`, the units are converted to `km` for altitude and distance and `km/h` for speed.                                                                                                                                                                                                                                                                                                                                                                                                     |
| `limit`          | `number`  | `null`                                                                         | A positive integer                                                  | Used to limit the number of results in the table.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `popup`          | `boolean` | `false`                                                                        | `true`, `false`                                                     | Enables or disables the popup. The popup requires both [browser_mod](https://github.com/thomasloven/hass-browser_mod) and [card-mod](https://github.com/thomasloven/lovelace-card-mod). The popup can be opened by clicking on a row and contains more data of the aircraft, including a photo of the aircraft provided by [Planespotters.net](https://www.planespotters.net/photo/api).<br><br>![Example of the popup](https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/popup.png?raw=true "Example of the popup") |
| `order`          | `string`  | `asc`                                                                          | `asc`, `desc`                                                       | Sort order of the data. Ascending (`asc`, smallest value first) or descending (`desc`, largest value first).                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `sort`           | `string`  | `altitude`                                                                     | Any column, see [columns](#columns)                                 | The data in the table is by default sorted on the altitude, with this option you can set a different column, for example `flight`.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `track_in_text`  | `boolean` | `false`                                                                        | `true`, `false`                                                     | By default the reported track of the aircraft is displayd in degrees `°`. With this option set to `true` the track is displayed in text.  When displayed in text, it's an abbreviation in the table and full text in the popup.                                                                                                                                                                                                                                                                                                               |
| `units_in_table` | `boolean` | `false`                                                                        | `true`, `false`                                                     | When this option is set to `true`, the table header will be appended with a second row containing the units.<br><br>![Units in the table header](https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/units.png?raw=true "Units in the table header")                                                                                                                                                                                                                                                                   |
| `units`          | `string`  | `default`                                                                      | `default`, `metric`                                                 | Sets the units for the values. The `default` units are as they are returned by Dump1090 (`ft` for altitude, `NM` for distance, `kt` for speed). When using `metric` the value and units are converted (`m` for altitude and distance, `m/s` for speed).                                                                                                                                                                                                                                                                                       |
| `zone`           | `string`  | `null`                                                                         | Any sensor that is a zone, example `zone.home`                      | The distance between Home Assistant and the reported position of the aircraft is calculated using the position of a zone. If you don't set a `zone` the data doesn't have the distance.                                                                                                                                                                                                                                                                                                                                                       |

## Colors

By default the card uses the primairy and secondairy colors of the active color scheme. In some cases this might lead to unwanted results. Using the `colors` object in the configuration of the card it's possible to overwrite the colors of both the table in the card and the popup.

The colors can be added as values that are accepted by CSS: HEX code (which must be enclosed by single quotes), RGB value, named color or a CSS variable. Example:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
colors:
  table_head_bg: var(--primary-color)
  table_head_text: yellow
  table_units_bg: rgb(187,78,123)
  table_units_text: '#00ff00'
```

With this option you can really go creative and make the ~~ugliest~~ most original creations. The following options are available:

| Key                         | Description                                                                                                                        |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| `table_head_bg`             | Background color of the table header                                                                                               |
| `table_head_text`           | Text color of the table header                                                                                                     |
| `table_units_bg`            | Background color of the row with the units                                                                                         |
| `table_units_text`          | Text color of the row with the units                                                                                               |
| `table_text`                | Default text color for cells                                                                                                       |
| `table_even_row_bg`         | Background color for every second row (zebra striping)                                                                             |
| `table_even_row_text`       | Text color for every second row (zebra striping)                                                                                   |
| `popup_bg`                  | Background color of the popup                                                                                                      |
| `popup_text`                | Default text color in the popup                                                                                                    |
| `popup_table_head_bg`       | Background color of the table header in the popup, if not used this option will fall back on `table_head_bg`                       |
| `popup_table_head_text`     | Text color of the table header in the popup, if not used this option will fall back on `table_head_text`                           |
| `popup_table_even_row_bg`   | Background color for every second row in the popup (zebra striping), if not used this option will fall back on `table_even_row_bg` |
| `popup_table_even_row_text` | Text color for every second row in the popup (zebra striping), if not used this option will fall back on `table_even_row_text`     |

## Columns

The card supports the following columns:

| Column         | Data                                                                                                                                          |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `age`          | Age of the message                                                                                                                            |
| `altitude`     | Reported altitude                                                                                                                             |
| `country`      | Country of registration                                                                                                                       |
| `distance`     | Calculated distance between the configured `zone` and the reported position                                                                   |
| `flag`         | Flag of the country of registration                                                                                                           |
| `flight`       | Flight number                                                                                                                                 |
| `icao`         | ICAO code of the aircraft                                                                                                                     |
| `icon`         | Icon for the airplane, unique colored based on the hex (`icao`) of the aircraft. Uses the vertical state of the aircraft for different icons. |
| `registration` | Registration code of the aircraft                                                                                                             |
| `speed`        | Reported speed                                                                                                                                |
| `squawk`       | Squawk code                                                                                                                                   |
| `track`        | Reported track                                                                                                                                |

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

| Option         | Type      | Default | Accepted                                               | Description                                                                                                                                                                                                                                                                                                                                       |
| :------------- | :-------- | :------ | :----------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `old_messages` | `boolean` | `true`  | `true`, `false`                                        | By default aircraft data which is received more than 30 seconds ago will be filtered out of the card. Setting this option to `false` will show all aircraft data that is available in the JSON file.                                                                                                                                              |
| `empty`        | `array`   |         | Array with columns, see [examples](#hide-empty-values) | By default, all aircraft are shown, including empty values in the table. With this option it is possible to set the columns that should not be empty. The array acts as an 'or' selector; if one of the columns has an empty value, the plane is not added to the table. This option is especially useful in combination with `sort` and `order`. |

### Hide empty values

With the option `hide.empty` it's possible to remove empty values from the table.

Example to remove all rows where there is no distance:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
hide:
  empty:
    - distance

```

Example to remove all rows where there is no distance *or* track:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
hide:
  empty:
    - distance
    - track

```

# F.A.Q.

Please read our [F.A.Q.](readme/faq.md) before opening an issue.
# Contribute

You can help improving this card by forking this repository and merging your changes with a pull request to the `develop` branch of this repository.

This applies not only to additions and improvements to the code, but certainly also to new [languages](src/javascript/lang/).

I am particularly interested in improvements to the registration code database. For more information about the database, click [here](readme/database.md).

# Credits

Honor where credit is due. This card could not have been made without consulting the following sources:

- The aircraft registration and country data is heavily inspired on the code from [FlightAware's Dump1090](https://github.com/flightaware/dump1090);
- The popup is working thanks to the excellent plugins by Thomas Lovén: [browser_mod](https://github.com/thomasloven/hass-browser_mod) and [card-mod](https://github.com/thomasloven/lovelace-card-mod);
- The aircraft photos in the popup are added with the use of the [Planespotters.net API](https://www.planespotters.net/photo/api).
