import { z } from 'zod';

import dbSchema from './db.schema';

export const writerSchema = dbSchema
  .extend({
    name: z.string().min(1),
  })
  .strict();
