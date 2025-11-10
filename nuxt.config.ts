import tailwindcss from "@tailwindcss/vite";
import * as child from "child_process";

const commit_hash = child.execSync("git rev-parse --short HEAD").toString();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "nuxt-svgo",
    "@nuxt/test-utils/module",
  ],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,

  typescript: {
    typeCheck: true,
  },

  css: ["./app/assets/css/main.css"],

  runtimeConfig: {
    public: {
      commit_hash,
      build_time: new Date().toISOString(),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  ui: {
    fonts: false,
    colorMode: false,
  },

  i18n: {
    strategy: "no_prefix",
    defaultLocale: "en",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "de", name: "Deutsch", file: "de.json" },
      { code: "fr", name: "Français", file: "fr.json" },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root", // recommended
    },
  },

  app: {
    head: {
      title: "Swissgeo Control",
    },
  },
});
