# Lovelace FR24 card

A custom card for Home Assistant to list the aircraft found in the [Dump1090][dump_1090] output of your ADS-B/Mode S receiver.

![Screenshot of FR24 card in action][img_screenshot]

This card is developed and tested based on the output of `data/aircraft.json` of the [FlightRadar24 Pi24 image][flight_radar].

The FR24 card has many configuration options and supports multiple languages.


**Did my project help you? Then you can always thank me with a coffee!**

[!["Buy Me A Coffee"][img_buy_me_a_coffee]][buy_me_a_coffee]

---

**Contents of this file**
- [Lovelace FR24 card](#lovelace-fr24-card)
- [Preparation](#preparation)
- [Installation](#installation)
- [Add the card to your dashboard](#add-the-card-to-your-dashboard)
- [Configuration](#configuration)
  - [Colors](#colors)
  - [Columns](#columns)
    - [Icon](#icon)
  - [Popup](#popup)
  - [Providers](#providers)
    - [Show external providers in popup](#show-external-providers-in-popup)
  - [Hide](#hide)
    - [General](#general)
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

[![hacs_badge][img_hacs_badge]][hacs_badge]

Install using [HACS][hacs], or follow [these instructions](readme/installation.md).

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

| Option             | Type      | Default                                                                        | Accepted                                                            | Description                                                                                                                                                                                                                                                                                                          |
| :----------------- | :-------- | :----------------------------------------------------------------------------- | :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attribute`        | `string`  | `aircraft`                                                                     | An attribute of the sensor                                          | By default the card will read the aircrafts from the sensors `aircraft` attribute. If your sensor uses a different attribute, change this value to the name of your attribute.                                                                                                                                       |
| `colors`           | `object`  |                                                                                |                                                                     | Used to overwrite the default color scheme of the card. See [Colors](#colors).                                                                                                                                                                                                                                       |
| `columns`          | `array`   | `["flag", "registration", "flight", "altitude", "speed", "distance", "track"]` | Array with any of the columns, see [Columns](#columns)              | Array containing the columns to show in the table. The data of the other columns is available in the popup, if that is enabled. Too many columns will break your Dashboard, so the card will give a warning if too many columns are added.                                                                           |
| `dbl_click_speed`  | `integer` | `250`                                                                          |                                                                     | Time in which a double click needs to be completed, else the click will be treated as single click. The single click will open the popup, the double click will open a new browser page with the flight details on the default external provider, see `default_provider`.                                            |
| `default_provider` | `string`  | `flightradar24`                                                                | Any external provider (see [providers](#providers)), or `false`.    | The external provider that is opened when a double click is registered. use `false` to disable the double click.                                                                                                                                                                                                     |
| `hide`             | `object`  |                                                                                |                                                                     | Used to configure which data is hidden. See [Hide](#hide).                                                                                                                                                                                                                                                           |
| `inverted_logo`    | `boolean` | `false`                                                                        | `true`, `false`                                                     | The default logo's are suitable for light backgrounds, used in the default color scheme of Home Assistant. If you used the [colors](#colors) to create a dark mode of the card, you can set this variable to `true` to use logo's suitable for a dark background. The logo's are used in the popup, see `providers`. |
| `lang`             | `string`  | `null`                                                                         | Any supported language, see the [lang folder](src/javascript/lang/) | Sets the display language of the data. By default the `hass` object of your browser will be used to set the language. If that language is not available, English will be used. The registered country is always in English.                                                                                          |
| `larger_units`     | `boolean` | `false`                                                                        | `true`, `false`                                                     | When using `metric` units, and this option set to `true`, the units are converted to `km` for altitude and distance and `km/h` for speed.                                                                                                                                                                            |
| `limit`            | `number`  | `null`                                                                         | A positive integer                                                  | Used to limit the number of results in the table.                                                                                                                                                                                                                                                                    |
| `order`            | `string`  | `asc`                                                                          | `asc`, `desc`                                                       | Sort order of the data. Ascending (`asc`, smallest value first) or descending (`desc`, largest value first).                                                                                                                                                                                                         |
| `popup`            | `object`  |                                                                                |                                                                     | Enables or disables the popup. The popup requires both [browser_mod][browser_mod] and [card-mod][card_mod]. The popup can be opened by clicking on a row and contains more data of the aircraft, including a photo of the aircraft provided by [Planespotters.net][planespotters]. See [Popup](#popup).              |
| `providers`        | `object`  |                                                                                |                                                                     | Holds an object with all the external providers that should be added to the footer of the popup. To enable the provider add the key of the provider as key in this object and use `true` as value. See [Providers](#providers).                                                                                      |
| `sort`             | `string`  | `altitude`                                                                     | Any column, see [columns](#columns)                                 | The data in the table is by default sorted on the altitude, with this option you can set a different column, for example `flight`.                                                                                                                                                                                   |
| `title`            | `string`  | `null`                                                                         |                                                                     | Title of the card.                                                                                                                                                                                                                                                                                                   |
| `track_in_text`    | `boolean` | `false`                                                                        | `true`, `false`                                                     | By default the reported track of the aircraft is displayd in degrees `°`. With this option set to `true` the track is displayed in text.  When displayed in text, it's an abbreviation in the table and full text in the popup.                                                                                      |
| `units_in_table`   | `boolean` | `false`                                                                        | `true`, `false`                                                     | When this option is set to `true`, the table header will be appended with a second row containing the units.<br><br>![Units in the table header][img_units]                                                                                                                                                          |
| `units`            | `string`  | `default`                                                                      | `default`, `metric`                                                 | Sets the units for the values. The `default` units are as they are returned by Dump1090 (`ft` for altitude, `NM` for distance, `kt` for speed). When using `metric` the value and units are converted (`m` for altitude and distance, `m/s` for speed).                                                              |
| `zone`             | `string`  | `null`                                                                         | Any sensor that is a zone, example `zone.home`                      | The distance between Home Assistant and the reported position of the aircraft is calculated using the position of a zone. If you don't set a `zone` the data doesn't have the distance.                                                                                                                              |

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

The card supports the following columns. Because there are many different formats of output of the Dump1090 (or Tar1090) data, not all columns are arvailable for each installation.

| Column          | Data                                                                        | Comment                                                                                                                                                                                                                      |
| :-------------- | :-------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `age`           | Age of the message                                                          |                                                                                                                                                                                                                              |
| `aircraft_type` | Reported aircraft type                                                      | Not the same as the `category` in the JSON. Not available in all installations. See issue [#15][i15].                                                                                                                        |
| `altitude`      | Reported altitude                                                           |                                                                                                                                                                                                                              |
| `country`       | Country of registration                                                     |                                                                                                                                                                                                                              |
| `distance`      | Calculated distance between the configured `zone` and the reported position |                                                                                                                                                                                                                              |
| `flag`          | Flag of the country of registration                                         |                                                                                                                                                                                                                              |
| `flight`        | Flight number                                                               |                                                                                                                                                                                                                              |
| `icao`          | ICAO code of the aircraft                                                   |                                                                                                                                                                                                                              |
| `icon`          | Icon for the aircraft                                                       | Icon representing altitude and vertical state of the aircraft. See [Icon](#icon).                                                                                                                                            |
| `registration`  | Registration code of the aircraft                                           | The registration of the aircraft is calculated based on the reported ICAO code. However, some of the JSON files contain the registration. If the registration is found in the JSON, this data is used. See issue [#15][i15]. |
| `speed`         | Reported speed                                                              |                                                                                                                                                                                                                              |
| `squawk`        | Squawk code                                                                 |                                                                                                                                                                                                                              |
| `track`         | Reported track                                                              |                                                                                                                                                                                                                              |

### Icon

The icon of an aircraft is based on the value of two elements in the aircraft data:

1. `vert_rate` -
   The vertical rate of the aircraft is used for the icon. An aircraft taking off is indicating with an icon where the cockpit rises up, while a landing aircraft has the cockpit pointing down. When an aircraft has no `vertical_rate`, or the value equals `0`, the icon is a top-down view of an aircraft.
2. `altitude` -
   The altitude of the aircraft is used for the color of the icon. When an aircraft is within the range the color is calculated as difference between the colors. This way an aircraft flying at 9000 ft has a slightly different color than an aircraft at 9500 ft.

| Altitude range in ft (min - max) | Color                                                                           |
| :------------------------------- | :------------------------------------------------------------------------------ |
| < 1000                           | `#EC5B13` ![#EC5B13][img_color_EC5B13]                                          |
| 1000 - 2000                      | `#EC5B13` ![#EC5B13][img_color_EC5B13] - `#EC7C13` ![#EC7C13][img_color_EC7C13] |
| 2000 - 4000                      | `#EC7C13` ![#EC7C13][img_color_EC7C13] - `#ECC813` ![#ECC813][img_color_ECC813] |
| 4000 - 6000                      | `#ECC813` ![#ECC813][img_color_ECC813] - `#BEDF13` ![#BEDF13][img_color_BEDF13] |
| 6000 - 8000                      | `#BEDF13` ![#BEDF13][img_color_BEDF13] - `#40EC44` ![#40EC44][img_color_40EC44] |
| 8000 - 10000                     | `#40EC44` ![#40EC44][img_color_40EC44] - `#11E276` ![#11E276][img_color_11E276] |
| 10000 - 20000                    | `#11E276` ![#11E276][img_color_11E276] - `#13BBDE` ![#13BBDE][img_color_13BBDE] |
| 20000 - 30000                    | `#13BBDE` ![#13BBDE][img_color_13BBDE] - `#241FEC` ![#241FEC][img_color_241FEC] |
| 30000 - 40000                    | `#241FEC` ![#241FEC][img_color_241FEC] - `#EB13EC` ![#EB13EC][img_color_EB13EC] |
| > 40000                          | `#EB13EC` ![#EB13EC][img_color_EB13EC]                                          |

![Example of the icons][img_icons]

## Popup
> [!WARNING]
> Before version 1.0.0 of this card the config `popup` was a boolean. In version 1.0.0 `popup` is replaced by an object.
> Update your card config.

The card supports a popup when you click on a row in the table. The popup displays all data of the aircraft, including a photo of the aircraft provided by [Planespotters.net][planespotters].

To enable the popup in the card use the following example:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
popup:
  enabled: true
```

By default the popup hides the header of the markdown card that is opened. The header contains the title of the card and a button to close the card. The button is not needed to close the popup, you can do that by clicking outside of the popup. If you want to display the header of the card you can do that with the `header` key. See the following example:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
popup:
  enabled: true
  header: true
```

![Example of the popup][img_popup]

## Providers
The card links to external providers that might use your data. The external providers are visible on two places:

1. As the value for the provider for the double click handler (`default_provider`);
2. When enabling the buttons in the popup (`providers`).

The following external providers can be used:

| Code              | Provider        |
| :---------------- | :-------------- |
| `adsbexchange`    | ADS-B Exchange  |
| `flightaware`     | FlightAware     |
| `flightradar24`   | Flightradar24   |
| `opensky_network` | OpenSky Network |
| `plane_finder`    | Plane Finder    |

### Show external providers in popup

By default none of the external providers is added to the popup. You have to enable them in the config of the card. Use the codes of the providers to enable them. Example:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
providers:
  adsbexchange: true
  flightaware: true
  flightradar24: true
  opensky_network: false
  plane_finder: true
```

In the example the logo for OpenSky Network will not be shown. When at least one external provider is added to the object, it is not needed to disable any providers you don't want to see. The next example had the same outcome:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
providers:
  adsbexchange: true
  flightaware: true
  flightradar24: true
  plane_finder: true
```

## Hide

With this object it's possible to set the configuration of the data that is hidden. Data must be added as an object in the yaml configuration. Example:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
hide:
  old_messages: false
```

The following keys are available in the object:

| Option            | Type      | Default | Accepted                                               | Description                                                                                                                                                                                                                                                                                                                                       |
| :---------------- | :-------- | :------ | :----------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `old_messages`    | `boolean` | `true`  | `true`, `false`                                        | By default aircraft data which is received more than 30 seconds ago will be filtered out of the card. Setting this option to `false` will show all aircraft data that is available in the JSON file.                                                                                                                                              |
| `ground_vehicles` | `boolean` | `false` | `true`, `false`                                        | By default all reported aircrafts are shown in the card, including ground vehicles. When this option is set to `true` ground vehicles are filtered out of the results. Ground vehicles are defined as results where the reported altitude equals `ground`.                                                                                        |
| `empty`           | `array`   |         | Array with columns, see [examples](#hide-empty-values) | By default, all aircraft are shown, including empty values in the table. With this option it is possible to set the columns that should not be empty. The array acts as an 'or' selector; if one of the columns has an empty value, the plane is not added to the table. This option is especially useful in combination with `sort` and `order`. |

### General

This example shows old messages, but removes ground vehicles:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
hide:
  old_messages: false
  ground_vehicles: true
```

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

- The aircraft registration and country data is heavily inspired on the code from [FlightAware's Dump1090][dump_1090_fa];
- The popup is working thanks to the excellent plugins by Thomas Lovén: [browser_mod][browser_mod] and [card-mod][card_mod];
- The aircraft photos in the popup are added with the use of the [Planespotters.net API][planespotters].

<!-- Documentation links -->
[browser_mod]: https://github.com/thomasloven/hass-browser_mod
[buy_me_a_coffee]: https://www.buymeacoffee.com/fratsloos
[card_mod]: https://github.com/thomasloven/lovelace-card-mod
[dump_1090_fa]: https://github.com/flightaware/dump1090
[dump_1090]: https://github.com/antirez/dump1090
[flight_radar]: https://www.flightradar24.com/build-your-own
[hacs_badge]: https://github.com/hacs/integration
[hacs]: https://hacs.xyz
[planespotters]: https://www.planespotters.net/photo/api

<!-- Issue links -->
[i15]: https://github.com/fratsloos/fr24_card/issues/15

<!-- Images -->
[img_buy_me_a_coffee]: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png
[img_hacs_badge]: https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge
[img_popup]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/popup.png?raw=true "Example of the popup"
[img_screenshot]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/fr24card.png?raw=true "Screenshot of FR24 card in action"
[img_units]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/units.png?raw=true "Units in the table header"
[img_icons]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/icons.png?raw=true "Different colored icons"
[img_color_EC5B13]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/color/EC5B13.png?raw=true "Example of color #EC5B13"
[img_color_EC5B13]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/color/EC5B13.png?raw=true "Example of color #EC5B13"
[img_color_EC7C13]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/color/EC7C13.png?raw=true "Example of color #EC7C13"
[img_color_ECC813]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/color/ECC813.png?raw=true "Example of color #ECC813"
[img_color_BEDF13]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/color/BEDF13.png?raw=true "Example of color #BEDF13"
[img_color_40EC44]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/color/40EC44.png?raw=true "Example of color #40EC44"
[img_color_11E276]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/color/11E276.png?raw=true "Example of color #11E276"
[img_color_13BBDE]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/color/13BBDE.png?raw=true "Example of color #13BBDE"
[img_color_241FEC]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/color/241FEC.png?raw=true "Example of color #241FEC"
[img_color_EB13EC]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/color/EB13EC.png?raw=true "Example of color #EB13EC"
