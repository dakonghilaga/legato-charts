import mount from 'koa-mount';

import { trackRoutes } from 'resources/track';

import { AppKoa } from 'types';

// TODO: basic auth middleware
export default (app: AppKoa) => {
  app.use(mount('/tracks', trackRoutes.privateRoutes));
};
