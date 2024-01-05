# Lovelace FR24 card

A custom card for Home Assistant to list the aircraft found in the [Dump1090][dump_1090] output of your ADS-B/Mode S receiver.

![Screenshot of FR24 card in action][img_screenshot]

This card is developed and tested based on the output of `data/aircraft.json` of the [FlightRadar24 Pi24 image][flight_radar].

The FR24 card has many [configuration](readme/configuration.md) options and supports multiple languages.


**Did my project help you? Then you can always thank me with a coffee!**

[!["Buy Me A Coffee"][img_buy_me_a_coffee]][buy_me_a_coffee]

# Preparation

To use the card you need to create a sensor that reads the JSON from Dump1090. Add the following [configuration](readme/configuration.md) to your `sensors.yaml`:

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

Install using [HACS][hacs], or follow [these instructions](readme/manual-installation.md).

# Add the card to your dashboard

The card can be added to your dashboard like any other card. If you do not see the card as an option, clear the cache of your browser and try again.

The minimal [configuration](readme/configuration.md) of the card contains only the entity of the sensor. When using the sensor from the above example, the card can be added with the following configuration:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
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
[img_screenshot]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/fr24card.png?raw=true "Screenshot of FR24 card in action"
