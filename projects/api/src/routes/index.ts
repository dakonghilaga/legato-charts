import { AppKoa } from 'types';

import attachCustomErrors from './middlewares/attach-custom-errors.middleware';
import attachCustomProperties from './middlewares/attach-custom-properties.middleware';
import routeErrorHandler from './middlewares/route-error-handler.middleware';
import publicRoutes from './public.routes';

const defineRoutes = (app: AppKoa) => {
  app.use(attachCustomErrors);
  app.use(attachCustomProperties);
  app.use(routeErrorHandler);

  publicRoutes(app);
};

export default defineRoutes;
