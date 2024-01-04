# Hide

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

## General

This example shows old messages, but removes ground vehicles:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
hide:
  old_messages: false
  ground_vehicles: true
```

## Hide empty values

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
