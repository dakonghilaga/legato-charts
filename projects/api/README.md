# Legato Charts API

### Features

1. Configured console logger
2. Automatic application restart when code changes
3. MongoDB configuration
4. Docker configuration for development and production environments.
5. Code linting based on [ESLint](https://eslint.org/).
6. Simplified request data validation based on [zod](https://zodjs.netlify.app/)

### Structure

```text
api/
├─ config/            # API configurations, ENVs, ENV validations etc.
├─ middlewares/       # Sets top-level middlewares, eg: rate-limit, validations 
├─ resources/         # Resource components: REST API, business logic, DB access, events, etc.
├─ routes/            # Koa.js routes and custom middlewares; Also manages private and public routes
├─ services/          # Shared services that could be used across this project boundaries
├─ utils/             # Shared utilities and helpers
├─ app.ts             # Project entry point
├─ db.ts              # MongoDB connection
├─ *.d.ts             # TS declarations for imported JS dependencies
├─ logger.ts          # Global logger instance
├─ redis-client.ts    # Redis client for rate limiter, etc.
├─ types.ts           # Project-wide TS types
```
