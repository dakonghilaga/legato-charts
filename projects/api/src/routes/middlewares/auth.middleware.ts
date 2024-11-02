import config from 'config';

import { AppKoaContext, Next } from 'types';

// TODO: THIS IS FOR DEMO PURPOSES ONLY
const auth = (ctx: AppKoaContext, next: Next) => {
  const { apikey } = ctx.headers;

  const isAllowed = config.DEMO_API_KEY === apikey && config.APP_ENV !== 'production';
  if (apikey && isAllowed) {
    return next();
  }

  ctx.status = 401;

  return null;
};

export default auth;
