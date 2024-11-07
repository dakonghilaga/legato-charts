# Legato Charts API

### Development Features

1. Configured console logger
2. Automatic application restart when code changes
3. MongoDB configuration
4. Docker configuration for development and production environments.
5. Code linting based on [ESLint](https://eslint.org/).
6. Simplified request data validation based on [zod](https://zodjs.netlify.app/)

### Structure

```text
api/
├─ config/                 # API configurations, ENVs, ENV validations etc.
├─ middlewares/            # Sets top-level middlewares, eg: rate-limit, validations 
├─ resources/              # Resource components
   ├─ {resource}/          # REST API, business logic, DB access, events, etc.
      ├─ actions/          # HTTP handlers
      ├─ index.ts          # Resource entry point
      ├─ *.routes.ts       # Resource mounted Koa routes
      ├─ *.services.ts     # Database logic functions
      ├─ *.handler.ts      # Event handlers
      ├─ tests/*.spec.ts   # Unit/ integration tests for resources
├─ routes/                 # Koa routes and custom middlewares; Also manages private and public routes
├─ services/               # Shared services that could be used across this project boundaries
├─ utils/                  # Shared utilities and helpers
├─ app.ts                  # Project entry point
├─ db.ts                   # MongoDB connection
├─ *.d.ts                  # TS declarations for imported JS dependencies
├─ logger.ts               # Global logger instance
├─ redis-client.ts         # Redis client for rate limiter, etc.
├─ types.ts                # Project-wide TS types
```

### Core Components

1. [Koa](https://koajs.com/): Web framework
2. [MongoDB](https://www.mongodb.com/resources/languages/mongodb-with-nodejs): Database
3. [Node Mongo](https://www.npmjs.com/package/@paralect/node-mongo): Lightweight reactive extension to official Node.js MongoDB driver.
4. [zod](https://zodjs.netlify.app/) Schema Validator
5. [CSV Parse](https://csv.js.org/parse/) Converting CSV into arrays or objects
6. [ioredis](https://www.npmjs.com/package/ioredis) Redis client for Node.js
7. [winston](https://www.npmjs.com/package/winston) Logging library
