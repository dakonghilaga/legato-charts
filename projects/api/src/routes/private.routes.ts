import compose from 'koa-compose';
import mount from 'koa-mount';

import { reportRoutes } from 'resources/report';
import { trackRoutes } from 'resources/track';

import { AppKoa } from 'types';

import auth from './middlewares/auth.middleware';

// TODO: Basic auth middleware
export default (app: AppKoa) => {
  app.use(mount('/tracks', compose([auth, trackRoutes.privateRoutes])));
  app.use(mount('/reports', compose([auth, reportRoutes.privateRoutes])));
};
