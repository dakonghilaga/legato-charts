import mount from 'koa-mount';

import { reportRoutes } from 'resources/report';
import { trackRoutes } from 'resources/track';

import { AppKoa } from 'types';

// TODO: basic auth middleware
export default (app: AppKoa) => {
  app.use(mount('/tracks', trackRoutes.privateRoutes));
  app.use(mount('/reports', reportRoutes.privateRoutes));
};
