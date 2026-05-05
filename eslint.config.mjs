// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import vueI18n from "@intlify/eslint-plugin-vue-i18n";

export default withNuxt(
  // Your custom configs here
  vueI18n.configs["flat/recommended"],
  {
    settings: {
      "vue-i18n": {
        localeDir: "./i18n/locales/*.json",
        messageSyntaxVersion: "^11.0.0", // version of `vue-i18n` you are using.
      },
    },
    rules: {
      "@intlify/vue-i18n/no-duplicate-keys-in-locale": "warn",
      "@intlify/vue-i18n/no-missing-keys-in-other-locales": "warn",
      "@intlify/vue-i18n/no-unknown-locale": "warn",
      "@intlify/vue-i18n/no-unused-keys": [
        "warn",
        {
          extensions: [".js", ".vue", ".ts"],
        },
      ],
      "@intlify/vue-i18n/no-raw-text": [
        "error",
        {
          attributes: {},
          ignoreNodes: ["pre"],
          ignorePattern: "",
          ignoreText: [],
        },
      ],
    },
  },
);
