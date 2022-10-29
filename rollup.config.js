import cleanup from "rollup-plugin-cleanup";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import minifyHTML from "rollup-plugin-minify-html-template-literals";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

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
  plugins: [
    minifyHTML({
      options: {
        shouldMinify: function () {
          return false;
        },
      },
    }),
    json(),
    commonjs(),
    nodeResolve(),
    terser({
      compress: false,
      keep_classnames: true,
      keep_fnames: true,
    }),
    cleanup({ comments: "none" }),
  ],
};
