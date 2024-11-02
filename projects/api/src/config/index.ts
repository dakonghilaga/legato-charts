import { z } from 'zod';

import { configUtil } from 'utils';

// environment variables schema
const schema = z.object({
  APP_NAME: z.string(),
  APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  IS_DEV: z.preprocess(() => process.env.APP_ENV === 'development', z.boolean()),
  PORT: z.coerce.number().optional().default(3001),

  API_URL: z.string(),

  MONGO_URI: z.string(),
  MONGO_DB_NAME: z.string(),

  REDIS_URI: z.string().optional(),
  REDIS_ERRORS_POLICY: z.enum(['throw', 'log']).default('log'),

  DEMO_API_KEY: z.string().optional().default('3.1415926535'),
});

type Config = z.infer<typeof schema>;

const config = configUtil.validateConfig<Config>(schema);

export default config;
