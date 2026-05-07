// prettier.config.js
/** @type {import('prettier').Config} */
export default {
  // Add semicolons at the end of statements
  semi: true,

  // Prefer single quotes for strings (except in JSX)
  singleQuote: true,

  // Use double quotes in JSX (matches HTML attributes)
  jsxSingleQuote: false,

  // Include trailing commas where valid in ES5 (objects, arrays, etc.)
  trailingComma: 'es5',

  // Wrap lines at 80 characters for better readability and git diffs
  printWidth: 80,

  // Use 2 spaces per indentation level
  tabWidth: 2,

  // Use spaces instead of tabs for indentation
  useTabs: false,

  // Print spaces between brackets in object literals: { foo: bar }
  bracketSpacing: true,

  // Always include parentheses around arrow function parameters
  arrowParens: 'always',

  // Use LF for line endings for cross-platform consistency
  endOfLine: 'lf',

  // Put the `>` of a multi-line JSX element on the next line
  bracketSameLine: false,
};
