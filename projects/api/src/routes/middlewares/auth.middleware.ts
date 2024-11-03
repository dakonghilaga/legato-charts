import config from 'config';

import { AppKoaContext, Next } from 'types';

// TODO: REPLACE SOON: THIS IS FOR DEMO PURPOSES ONLY
const auth = (ctx: AppKoaContext, next: Next) => {
  const demoApiKey = ctx.headers['x-demo-api-key'];

  const hasAccess = config.DEMO_API_KEY === demoApiKey;
  const isNonProd = config.APP_ENV !== 'production';

  if (hasAccess && isNonProd) {
    return next();
  }

  if (config.IS_DEV) {
    return next();
  }

  ctx.status = 401;

  return null;
};

export default auth;
