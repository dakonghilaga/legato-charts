import { z } from 'zod';

import dbSchema from './db.schema';
import { trackCsvRowSchema } from './track.schema';

const writerSchemaPrimary = dbSchema
  .extend({
    name: z.string().min(1),

    dataSource: z.enum(['csv']).optional(),
  })
  .strict();

export const writerSchema = writerSchemaPrimary.extend(trackCsvRowSchema.shape);
