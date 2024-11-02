import { z } from 'zod';

import dbSchema from './db.schema';
import { trackCsvRowSchema } from './track.schema';

const artistSchemaPrimary = dbSchema
  .extend({
    name: z.string().min(1),

    dataSource: z.enum(['csv']).optional(),
  })
  .strict();

export const artistSchema = artistSchemaPrimary.extend(trackCsvRowSchema.shape);
