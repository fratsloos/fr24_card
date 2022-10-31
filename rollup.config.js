import cleanup from "rollup-plugin-cleanup";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import minifyHTML from "rollup-plugin-minify-html-template-literals";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

let plugins = [json(), commonjs(), nodeResolve()];

if (process.env.NODE_ENV === "production") {
  plugins = plugins.concat([
    minifyHTML(),
    terser(),
    cleanup({ comments: "none" }),
  ]);
}

export default {
  input: "src/javascript/fr24_card.js",
  onwarn: function (message, next) {
    if (/node_modules/.test(message.id)) return;
    next(message);
  },
  output: {
    file: "dist/fr24_card.js",
    format: "cjs",
  },
  plugins: plugins,
};
