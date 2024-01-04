# Providers

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

## Show external providers in popup

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
