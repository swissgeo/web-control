import tailwindcss from "@tailwindcss/vite";
import * as child from "child_process";

const commit_hash = child.execSync("git rev-parse --short HEAD").toString();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    // this is important. Otherwise it'll use the preset 'aws-amplify' (https://nitro.build/deploy/providers/aws-amplify)
    // which in this case doesn't make much sense. On the contrary, it somehow prevents the nitro crawler
    // to properly discover and prerender all routes
    preset: "static",
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "nuxt-svgo",
    "@nuxt/test-utils/module",
    "@pinia/nuxt",
  ],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,

  typescript: {
    typeCheck: true,
  },

  css: ["./app/assets/css/main.css"],

  runtimeConfig: {
    public: {
      commit_hash,
      build_time: new Date().toISOString(),
      end_user_client_id: "",
      m2m_user_client_id: "",
      cognito_domain: "",
      cognito_cf_proxy_domain: "",
      cognito_user_pool_url: "",
      eiam_logout_url: "",
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
