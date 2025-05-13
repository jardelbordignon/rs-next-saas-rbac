/** @typedef {import("prettier").Config} PrettierConfig */

import backend from "./index.mjs";

/** @type {PrettierConfig} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  ...backend,
};

export default config;
