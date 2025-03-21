import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,vue}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    rules: {
      "semi": "off",
      "vue/multi-word-component-names": "off",
      "indent": ["error", 2],
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "no-irregular-whitespace": "error",
      "no-inline-comments": "error",
      "multiline-comment-style": ["error"],
      "eqeqeq": ["error", "always"],
      "prefer-const": "error",
      "no-unused-vars": "error",
      "camelcase": "error",
      "no-whitespace-before-property": "error",
      "spaced-comment": ["error", "always"]
    },
  }
];