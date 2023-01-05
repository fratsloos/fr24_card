import { objectMerge } from "deep-merge-object";
import availableColumns from "./columns.json";

export default class Config {
  constructor(card) {
    // Card configuration
    this.card = card;

    // Default configuration
    this.default = {
      attribute: "aircraft",
      columns: [
        "flag",
        "registration",
        "flight",
        "altitude",
        "speed",
        "distance",
        "track",
      ],
      hide: {
        old_messages: true,
        empty: [],
      },
      lang: null,
      larger_units: false,
      limit: null,
      order: "asc",
      popup: false,
      sort: "altitude",
      track_in_text: false,
      units: "default",
      units_in_table: false,
      zone: null,
      colors: {
        table_head_bg: null,
        table_head_text: null,

        table_units_bg: null,
        table_units_text: null,

        table_text: null,

        table_even_row_bg: null,
        table_even_row_text: null,

        popup_bg: null,
        popup_text: null,

        popup_table_head_bg: null,
        popup_table_head_text: null,

        popup_table_even_row_bg: null,
        popup_table_even_row_text: null,
      },
    };

    // Merged configuration (default and card merged)
    this.merged = {};

    // Validation error
    this.error = "";

    // Merge the default and card config
    this.merge();
  }

  /**
   * Merges the default config with the card config and stores it in the object
   */
  merge = function () {
    this.merged = objectMerge(this.default, this.card);
  };

  /**
   * Returns the merged config
   *
   * @returns {Object}
   */
  get = function () {
    return this.merged;
  };

  /**
   * Validates the card config
   *
   * Validates the card config and sets an error when the validation fails.
   *
   * @returns {Boolean}
   */
  validate = function () {
    // Check for entity, unit, order
    if (!this.merged.entity) {
      this.error = "You need to define and entity";
    } else if (!["default", "metric"].includes(this.merged.units)) {
      this.error = "Unit '" + this.merged.units + "' is not supported";
    } else if (!["asc", "desc"].includes(this.merged.order)) {
      this.error = "Order '" + this.merged.order + "' is not supported";
    } else {
      let totalWeight = 0;
      this.merged.columns.forEach((column) => {
        if (!availableColumns.hasOwnProperty(column)) {
          throw new Error("Column '" + column + "' does not exist");
        }

        totalWeight += availableColumns[column].weight;
      });

      if (totalWeight > 15) {
        this.error = "Too many columns defined";
      }
    }

    // Return result
    return this.error === "";
  };
}
