import { z } from 'zod';

import dbSchema from './db.schema';

export const artistSchema = dbSchema
  .extend({
    name: z.string().min(1),

    dataSource: z.enum(['csv']).optional(),

    // TODO: Preprocess types depending on data source value
    dataSourceAttributes: z.record(z.string()),
  })
  .strict();
