import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: [
      "pages/**/*.{js}",
      "utils/**/*.js",
    ],
},
  {languageOptions: { globals:{ 
    process: 'readonly',
    __dirname: 'readonly',
    require: 'readonly',
    styles: 'readonly',
    ...globals.browser,

  }}},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'semi': ['error', 'always'],
      'no-var': ['error',],
      'prefer-const': ['error', { 'destructuring': 'any', 'ignoreReadBeforeAssign': false }],
      'curly': ['error'],
      'eqeqeq': ['error'],
      'no-multi-spaces': ['error'],
      'no-lone-blocks': ['error'],
      'no-self-compare': ['error'],
      'no-unused-expressions': ['error'],
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          caughtErrors: 'none', // Ignore unused variables in catch blocks
        },
      ],
      'no-useless-call': ['error'],
      'no-use-before-define': ['error'],
      'camelcase': ['error', { properties: 'never' }],
      'func-call-spacing': ['error'],
      'no-lonely-if': ['error'],
      'array-bracket-spacing': ['error'],
      'no-console': ['off']
  }
  },
  {
    ignores: [
      "node_modules/**",
      "cypress/**",
      "public/**",
      "styles/**",
      "documentation/**",
      "unit_test/**",
      "*.config.js", // Ignore config files at the root
      "vite.config.js",
    ],
  },
];