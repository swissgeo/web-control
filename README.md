# SWISSGEO control

This is the frontend ("business portal") for the SWISSGEO control infrastructure.

| Branch  | Status                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| develop | ![Build Status](https://codebuild.eu-central-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiZ3FHci9lK1VBNHBQNEJFVnNObCtFVitLWGRqVDh2OVBFWmp2V2d4OW8zZGkyZU9aVWFTVFFpUXFreDB3cm5MVDBMY21jdTFHOEdOY1Ywc3RlZkdpYzRrPSIsIml2UGFyYW1ldGVyU3BlYyI6IkN1RytjTlpYeW95aGZQcWwiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=develop) [![codecov-develop](https://codecov.io/gh/swissgeo/web-control/branch/develop/graph/badge.svg)](https://codecov.io/gh/swissgeo/web-control) |
| main    | ![Build Status](https://codebuild.eu-central-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiZ3FHci9lK1VBNHBQNEJFVnNObCtFVitLWGRqVDh2OVBFWmp2V2d4OW8zZGkyZU9aVWFTVFFpUXFreDB3cm5MVDBMY21jdTFHOEdOY1Ywc3RlZkdpYzRrPSIsIml2UGFyYW1ldGVyU3BlYyI6IkN1RytjTlpYeW95aGZQcWwiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main) [![codecov-main](https://codecov.io/gh/swissgeo/web-control/branch/main/graph/badge.svg)](https://codecov.io/gh/swissgeo/web-control)          |

- [Quickstart](#quickstart)
- [Deployment](#deployment)
- [Render mode](#render-mode)
- [Tech](#tech)
  - [Base Framework: nuxt](#base-framework-nuxt)
  - [UI Framework: nuxt ui](#ui-framework-nuxt-ui)
  - [Translations](#translations)
  - [Forms and validation](#forms-and-validation)
- [Format \& Linting](#format--linting)
- [Testing](#testing)
  - [Unit tests](#unit-tests)
  - [Testing Nuxt components](#testing-nuxt-components)
  - [End-to-end tests](#end-to-end-tests)

## Quickstart

Install dependencies, create environment and run service in debug mode:

```bash
make setup
make env
make serve
```

Open a browser at [http://localhost:3000](http://localhost:3000).

Some environment variables are read from aws ssm parameters. To run `make env` make sure to login with aws sso first. By default the environment will connect to the dev environment backend.

## Deployment

This project is run without nuxt [server-side-rendering](nuxt.config.ts#L28) as most data is not static and retrieved at run-time. There is currently also no need to SEO.

## Render mode

The project is set to be prerendered as a static page. The crucial piece for this is setting the preset to static in the [nitro config](nuxt.config.ts#L12)

## Tech

Following is a quick overview of the used technology:

### Base Framework: nuxt

We use [nuxt](https://nuxt.com/) as the base framework. Nuxt wraps around vue.js and provides a lot more functionality out of the box.
The rendering mode is set to [client-side-rendering](https://nuxt.com/docs/4.x/guide/concepts/rendering#client-side-rendering). We don't need the nitro server functionality and instead build the application in a common SPA style.

### UI Framework: nuxt ui

For the UI we use [nuxt ui](https://ui.nuxt.com) because of it's seamless integration with the framework. Check the [components list](https://ui.nuxt.com/docs/components) for the available components.

Nuxt UI components are built on CSS Framework [Tailwind](https://tailwindcss.com/).

### Translations

To translate a string, define in the all the locale JSON's and use it with the `$t` in the code and/or template. For example:

```json
{
  "messages": {
    "hello": "hello"
  }
}
```

```vue
<script>
const message = $t("message.hello");
</script>

<template>
  <h1 :data-message="$t('message.hello')">{{ $t("message.hello") }}</h1>
</template>
```

Have a look at [Nuxt I18n](https://i18n.nuxtjs.org/docs/getting-started/usage) and [Vue I18n](https://vue-i18n.intlify.dev/guide/essentials/started) to see how to interpolate strings, formatting dates etc.

### Forms and validation

We use the Nuxt UI Form component. It supports any validation library supporting [Standard Schema](https://github.com/standard-schema/standard-schema). In this project we use [valibot](https://github.com/open-circle/valibot).
Examples and usage can be found on the [NUXT UI Form](https://ui.nuxt.com/docs/components/form) documentation.

## Format & Linting

```bash
make format
make lint
```

## Testing

Testing approach follows the [Nuxt guide](https://nuxt.com/docs/4.x/getting-started/testing), with e2e tests using [playwright](https://playwright.dev/) and component & unit tests using vitest.

Run all tests:

```bash
make test
```

### Unit tests

Unit tests run in a node environment. This is defined in the [vitest configuration](./vitest.config.ts).

Run the unit tests in watch mode:

```bash
make test-unit
```

### Testing Nuxt components

Nuxt tests run in a nuxt environment. This is defined in the [vitest configuration](./vitest.config.ts).

Run the nuxt tests in watch mode:

```bash
make test-nuxt
```

### End-to-end tests

To run the e2e tests, invoke

```bash
make test-e2e
```
