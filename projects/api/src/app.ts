/* eslint-disable simple-import-sort/imports, import/newline-after-import, import/first */
// Allows requiring modules relative to /src folder,
// See: https://gist.github.com/branneman/8048520
import moduleAlias from 'module-alias';
moduleAlias.addPath(__dirname);
moduleAlias(); // read aliases from package json

import 'dotenv/config';

import cors from '@koa/cors';
import http from 'http';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import koaLogger from 'koa-logger';
import qs from 'koa-qs';

import routes from 'routes';

import config from 'config';

import redisClient, { redisErrorHandler } from 'redis-client';

import logger from 'logger';

import { AppKoa } from 'types';

const initKoa = () => {
  logger.warn(`
    *********************************************************      
    FIX THIS BEFORE GOING TO PRODUCTION:
    -> projects/api/src/routes/middlewares/auth.middleware.ts
    *********************************************************
  `);

  const app = new AppKoa();

  app.proxy = true; // when true proxy header fields will be trusted
  app.use(cors({ credentials: true }));
  app.use(helmet());
  qs(app);
  app.use(
    bodyParser({
      enableTypes: ['json', 'form', 'text'],
      onerror: (err: Error, ctx) => {
        const errText: string = err.stack || err.toString();
        logger.warn(`Unable to parse request body. ${errText}`);
        ctx.throw(422, 'Unable to parse request JSON.');
      },
    }),
  );
  app.use(
    koaLogger({
      transporter: (message, args) => {
        const [, method, endpoint, status, time, length] = args;

        logger.http(message.trim(), { method, endpoint, status, time, length });
      },
    }),
  );

  routes(app);

  return app;
};

const app = initKoa();

(async () => {
  const server = http.createServer(app.callback());

  if (config.REDIS_URI) {
    await redisClient.connect().catch(redisErrorHandler);
  }

  server.listen(config.PORT, () => {
    logger.info(`API server is listening on ${config.PORT} in ${config.APP_ENV} environment`);
  });
})();

export default app;
