import { z } from 'zod';

import dbSchema from './db.schema';

export const albumSchema = dbSchema
  .extend({
    name: z.string().min(1),
    releaseYear: z.number(),
  })
  .strict();
