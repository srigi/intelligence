/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 144,
  singleQuote: true,
  tailwindFunctions: ['cn', 'cva'],
  tailwindStylesheet: './src/index.css',
};
