# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Serverless Framework v4 reference architecture demonstrating a custom Lambda authorizer on AWS API Gateway HTTP API (v2). Part of a "zero trust Serverless on AWS" series. The authorizer gate-keeps a single `/greeting` GET endpoint.

## Commands

```bash
npm test              # lint + unit tests
npm run test:e2e      # e2e tests against deployed stack (requires AWS credentials + deployed stack)
npm run lint          # ESLint only
npm run lint:fix      # ESLint with auto-fix
npm run deploy        # deploy to AWS via Serverless Framework
npm run remove        # tear down the stack
```

To run a single unit test file:

```bash
npx jest test/identity.unit.test.js
```

E2E tests auto-discover the API URL from CloudFormation stack outputs (`HttpApiUrl`) — no manual env var needed, but the stack must be deployed first.

## Architecture

Two Lambda functions defined in [serverless.yml](serverless.yml):

- **`authorizerFunction`** ([src/authorizer.js](src/authorizer.js)) — Lambda request authorizer. Validates the `Authorization` header by extracting the Bearer token and checking if it is numeric. Returns `{ isAuthorized: boolean }` using the simple response format. Attached to every route via `httpApi.authorizers.customAuthorizer`.

- **`getGreeting`** ([src/handler.js](src/handler.js)) — The protected handler, wrapped in middy with `input-output-logger` and `http-error-handler` middleware.

Logging uses `@aws-lambda-powertools/logger` in both functions and in the middy I/O logger config ([src/middyIoLoggerConfiguration.js](src/middyIoLoggerConfiguration.js)).

Build uses esbuild (via Serverless Framework's built-in esbuild support) — bundled, minified, packaged individually per function.

## Testing

**Unit tests** match `*.unit.test.js`. The only unit test ([test/identity.unit.test.js](test/identity.unit.test.js)) is a placeholder — real behavior is covered by e2e tests.

**E2E tests** match `*.e2e.test.js`. [test/jest.setup.js](test/jest.setup.js) runs as `globalSetup` and queries CloudFormation to resolve the deployed API URL into `process.env.API_URL`. Uses a 60-second timeout. Tests exercise the three authorization paths: valid token (numeric Bearer) → 200, invalid token (non-numeric Bearer) → 403, missing header → 401.

The e2e test config extends the base jest config: [jest.config.e2e.js](jest.config.e2e.js).

## Key Conventions

- ESM (`import`/`export`) throughout — SWC handles transpilation for Jest.
- `max-params: warn 1` and `no-param-reassign: error` are enforced by ESLint.
- `no-only-tests` is enforced — `.only` in tests will fail CI.
- Husky pre-commit runs lint-staged (ESLint + Prettier) on staged JS/TS/MD files.
- Stage defaults to `dev`; AWS region defaults to `us-east-1`.
