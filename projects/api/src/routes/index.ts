import { AppKoa } from 'types';

import attachCustomErrors from './middlewares/attach-custom-errors.middleware';
import attachCustomProperties from './middlewares/attach-custom-properties.middleware';
import routeErrorHandler from './middlewares/route-error-handler.middleware';
import privateRoutes from './private.routes';
import publicRoutes from './public.routes';

const defineRoutes = (app: AppKoa) => {
  app.use(attachCustomErrors);
  app.use(attachCustomProperties);
  app.use(routeErrorHandler);

  publicRoutes(app);
  privateRoutes(app);
};

export default defineRoutes;
