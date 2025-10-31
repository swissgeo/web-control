# Swissgeo control

This is the frontend ("business portal") for the Swissgeo control infrastructure.

## Quickstart

Use common `pnpm` command to install and start the project:

```bash
pnpm install
pnpm run dev # local dev server
pnpm build # build the project
```

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
