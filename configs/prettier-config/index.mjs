/** @typedef {import("prettier").Config} PrettierConfig */

/** @type {PrettierConfig} */
const config = {
  printWidth: 86,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: "as-needed",
  jsxSingleQuote: true,
  trailingComma: "all",
  arrowParens: "avoid",
  endOfLine: "auto",
  bracketSpacing: true,
  bracketSameLine: false,
};

export default config;
