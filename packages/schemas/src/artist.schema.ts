import { z } from 'zod';

import dbSchema from './db.schema';

export const artistSchema = dbSchema
  .extend({
    name: z.string().min(1),
  })
  .strict();
