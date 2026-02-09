# SWISSGEO control

This is the frontend ("business portal") for the SWISSGEO control infrastructure.

| Branch  | Status                                                                                                                                                                                                                                                                                                                      |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| develop | ![Build Status](https://codebuild.eu-central-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiZ3FHci9lK1VBNHBQNEJFVnNObCtFVitLWGRqVDh2OVBFWmp2V2d4OW8zZGkyZU9aVWFTVFFpUXFreDB3cm5MVDBMY21jdTFHOEdOY1Ywc3RlZkdpYzRrPSIsIml2UGFyYW1ldGVyU3BlYyI6IkN1RytjTlpYeW95aGZQcWwiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=develop) |
| main    | ![Build Status](https://codebuild.eu-central-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiZ3FHci9lK1VBNHBQNEJFVnNObCtFVitLWGRqVDh2OVBFWmp2V2d4OW8zZGkyZU9aVWFTVFFpUXFreDB3cm5MVDBMY21jdTFHOEdOY1Ywc3RlZkdpYzRrPSIsIml2UGFyYW1ldGVyU3BlYyI6IkN1RytjTlpYeW95aGZQcWwiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main)    |

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

## Render mode

The project is set to be prerendered as a static page. The crucial piece for this is setting the preset to static in the [nitro config](nuxt.config.ts#L12)

## Tech

Following is a quick overview of the used technology:

### Base Framework: nuxt

We use [nuxt](git@github.com:swissgeo/web-control.git) Nuxt as the base framework. Wraps around vue.js and provides a lot more functionality out of the box.
The rendering mode is set to [client-side-rendering](https://nuxt.com/docs/4.x/guide/concepts/rendering#client-side-rendering). We don't need the nitro server functionality and instead build the application in a common SPA style.

### UI Framework: nuxt ui

For the UI we use [nuxt ui](https://ui.nuxt.com) because of it's seamless integration with the framework. Check the [components list](https://ui.nuxt.com/docs/components) for the available components.
Currently there's no predefined template in place, it might make sense to adopt to a [predefined template](https://ui.nuxt.com/templates) once we know more about the needed functionality.

### Testing: playwright

Currently the e2e tests are setup with [playwright](https://playwright.dev/). This seems to be better integrated with nuxt, but deviates from our standard setup with cypress.
I figured for this use case it might be good enough for now, as we'll have to see how we'll be doing tests (e2e testing is usually harder in case of business applications, since that requires a setup on the backend as well. Maybe we'll stick more to component testing)

## Testing

To run the e2e test, invoke

```bash
pnpm run test:e2e
```

Dummy changes for test PR auto link test
