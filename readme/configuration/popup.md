# Popup

> [!WARNING]
> Before version 1.0.0 of this card the config `popup` was a boolean. In version 1.0.0 `popup` is replaced by an object.
> Update your card config.

The card supports a popup when you click on a row in the table. The popup displays all data of the aircraft, including a photo of the aircraft provided by [Planespotters.net][planespotters].

## Enable the popup

To enable the popup in the card use the following example:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
popup:
  enabled: true
```

## Closing the popup (card_mod popup header)

By default the popup hides the header of the markdown card that is opened. The header contains the title of the card and a button to close the card. The button is not needed to close the popup, you can do that by clicking outside of the popup. If you want to display the header of the card you can do that with the `header` key. See the following example:

```yaml
type: custom:fr24-card
entity: sensor.fr24_aircraft
popup:
  enabled: true
  header: true
```

![Example of the popup][img_popup]

## Options
The following options are available in the `popup` object:

| Option    | Type      | Default | Accepted        | Description                                                                                                                                                               |
| :-------- | :-------- | :------ | :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `enabled` | `boolean` | `false` | `true`, `false` | Enables or disables the popup when clicking on a row in the table.                                                                                                        |
| `header`  | `boolean` | `false` | `true`, `false` | Show (`true`) or hide the header of card_mod. The header contains a title and a button to close the popup. The popup is also closed when clicking outside of the content. |
| `photo`   | `boolean` | `true`  | `true`, `false` | Shows (when `true`) a photo of the aircraft provided by [Planespotters.net][planespotters].                                                                               |

<!-- Documentation links -->
[planespotters]: https://www.planespotters.net/photo/api

<!-- Images -->
[img_popup]: https://raw.githubusercontent.com/fratsloos/fr24_card/master/readme/images/popup.png?raw=true "Example of the popup"
