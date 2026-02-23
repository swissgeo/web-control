# SWISSGEO control

This is the frontend ("business portal") for the SWISSGEO control infrastructure.

| Branch  | Status                                                                                                                                                                                                                                                                                                                      |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| develop | ![Build Status](https://codebuild.eu-central-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiZ3FHci9lK1VBNHBQNEJFVnNObCtFVitLWGRqVDh2OVBFWmp2V2d4OW8zZGkyZU9aVWFTVFFpUXFreDB3cm5MVDBMY21jdTFHOEdOY1Ywc3RlZkdpYzRrPSIsIml2UGFyYW1ldGVyU3BlYyI6IkN1RytjTlpYeW95aGZQcWwiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=develop) |
| main    | ![Build Status](https://codebuild.eu-central-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiZ3FHci9lK1VBNHBQNEJFVnNObCtFVitLWGRqVDh2OVBFWmp2V2d4OW8zZGkyZU9aVWFTVFFpUXFreDB3cm5MVDBMY21jdTFHOEdOY1Ywc3RlZkdpYzRrPSIsIml2UGFyYW1ldGVyU3BlYyI6IkN1RytjTlpYeW95aGZQcWwiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main)    |

- [Quickstart](#quickstart)
- [Deployment](#deployment)
- [Render mode](#render-mode)
- [Tech](#tech)
  - [Base Framework: nuxt](#base-framework-nuxt)
  - [UI Framework: nuxt ui](#ui-framework-nuxt-ui)
- [Testing](#testing)
  - [End-to-end tests](#end-to-end-tests)
  - [Testing Nuxt components](#testing-nuxt-components)
  - [Unit tests](#unit-tests)

## Quickstart

Use common `pnpm` command to install and start the project:

```bash
pnpm install
pnpm run dev # local dev server
pnpm build # build the project
```

For E2E tests you also need to install playwright dependencies as follow

```bash
pnpm exec playwright install --with-deps
```

## Deployment

This project is automatically deployed to Swissgeo dev, as well as to the int and prod staging environments, upon merging a PR into the develop or main branch.

## Render mode

The project is set to be prerendered as a static page. The crucial piece for this is setting the preset to static in the [nitro config](nuxt.config.ts#L12)

## Tech

Following is a quick overview of the used technology:

### Base Framework: nuxt

We use [nuxt](https://nuxt.com/) as the base framework. Nuxt wraps around vue.js and provides a lot more functionality out of the box.
The rendering mode is set to [client-side-rendering](https://nuxt.com/docs/4.x/guide/concepts/rendering#client-side-rendering). We don't need the nitro server functionality and instead build the application in a common SPA style.

### UI Framework: nuxt ui

For the UI we use [nuxt ui](https://ui.nuxt.com) because of it's seamless integration with the framework. Check the [components list](https://ui.nuxt.com/docs/components) for the available components.
Currently there's no predefined template in place, it might make sense to adopt to a [predefined template](https://ui.nuxt.com/templates) once we know more about the needed functionality.

## Testing

Testing approach follows the [Nuxt guide](https://nuxt.com/docs/4.x/getting-started/testing), with e2e tests using [playwright](https://playwright.dev/) and component & unit tests using vitest.

### End-to-end tests

To run the e2e tests, invoke

```bash
pnpm run test:e2e
```

### Testing Nuxt components

Nuxt tests run in a nuxt environment. This is defined in the [vitest configuration](./vitest.config.ts).

To run the nuxt tests, invoke

```bash
pnpm run test:nuxt
```

### Unit tests

Unit tests run in a node environment. This is defined in the [vitest configuration](./vitest.config.ts).

To run the unit test, invoke

```bash
pnpm run test:unit
```
