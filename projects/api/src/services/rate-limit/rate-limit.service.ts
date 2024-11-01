import { ParameterizedContext } from 'koa';
import rateLimit from 'koa-ratelimit';

import redisClient from 'redis-client';

const rateLimiter = (limitDuration: number, requestsPerDuration: number): ReturnType<typeof rateLimit> => {
  const errorMessage = 'Too many Requests. Please reach out to support for further inquiries';

  return rateLimit({
    driver: 'redis',
    db: redisClient,
    duration: limitDuration,
    max: requestsPerDuration,
    // TODO: Pass user auth token here
    id: (ctx: ParameterizedContext) => ctx.ip,
    errorMessage,
    disableHeader: false,
    throw: true,
  });
};

export default rateLimiter;
