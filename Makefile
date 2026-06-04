SHELL = /bin/bash

# Commands
NODE_MANAGER := pnpm


.PHONY: setup
setup:  ## Install dependencies
	$(NODE_MANAGER) install

.PHONY: format
format:  ## Format code base
	$(NODE_MANAGER) run format

.PHONY: lint
lint:  ## Lint code base
	$(NODE_MANAGER) run lint

.PHONY: test-e2e
test-e2e:  ## Run end-to-end test
	$(NODE_MANAGER) run test:e2e

.PHONY: test-nuxt
test-nuxt:  ## Run nuxt tests in watch mode
	$(NODE_MANAGER) run test:nuxt

.PHONY: test-unit
test-unit:  ## Run unit tests in watch mode
	$(NODE_MANAGER) run test:unit

.PHONY: test
test:  ## Run all tests without watch mode
	$(NODE_MANAGER) run test:run:unit
	$(NODE_MANAGER) run test:run:nuxt
	$(NODE_MANAGER) test:e2e

.PHONY: ci
ci: setup format lint test  ## Run setup format lint and tests

.PHONY: serve
serve:  ## Run in dev mode
	$(NODE_MANAGER) run dev

.PHONY: env
env:  ## create local .env file
	cp .env.default .env
	COGNITO_APP_CLIENT_ID=$$(aws-ssm get -p swisstopo-swissgeo-dev -n /amazon-cognito/dev/auth-swissgeo-users-dev/clients/web-control/id -o) envsubst < .env > .env.tmp && mv .env.tmp .env

.PHONY: help
help: ## Display this help
# automatically generate the help page based on the documentation after each make target
# from https://gist.github.com/prwhite/8168133
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
