# Columns

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

## Icon

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

<!-- Images -->
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
