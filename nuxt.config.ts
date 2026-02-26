import tailwindcss from "@tailwindcss/vite";
import * as child from "child_process";

const commitHash = child.execSync("git rev-parse --short HEAD").toString();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    // this is important. Otherwise it'll use the preset 'aws-amplify' (https://nitro.build/deploy/providers/aws-amplify)
    // which in this case doesn't make much sense. On the contrary, it somehow prevents the nitro crawler
    // to properly discover and prerender all routes
    preset: "static",
  },
  sourcemap:
    process.env.DEBUG_BUILD === "true"
      ? {
          client: true,
          server: false,
        }
      : false,

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "nuxt-svgo",
    "@nuxt/test-utils/module",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
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
      environment: "",
      commitHash,
      buildTime: new Date().toISOString(),
      cognitoAppClientId: "",
      cognitoDomain: "",
      cognitoUserPoolUrl: "",
      eiamLogoutUrl: "",
      eiamIdentityProvider: "",
      serviceControlBase: "",
      defaultM2MScope: "",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  pinia: {
    storesDirs: ["./stores/**"],
  },

  ui: {
    fonts: false,
    colorMode: false,
  },

  i18n: {
    strategy: "no_prefix",
    defaultLocale: "en",
    locales: [
      {
        code: "en",
        name: "English",
        file: {
          path: "en.json",
        },
      },
      {
        code: "de",
        name: "Deutsch",
        file: {
          path: "de.json",
        },
      },
      {
        code: "fr",
        name: "Français",
        file: {
          path: "fr.json",
        },
      },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "selectedLanguage",
      redirectOn: "root", // recommended
    },
  },

  app: {
    head: {
      title: "SWISSGEO Control",
    },
  },

  googleFonts: {
    families: {
      Inter: true,
    },
  },
});
