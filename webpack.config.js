const path = require("path");

module.exports = {
  entry: "./src/javascript/fr24_card.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "fr24_card.js",
  },
};
