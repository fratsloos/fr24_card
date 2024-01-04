# Colors

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
