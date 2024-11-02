import { z } from 'zod';

import dbSchema from './db.schema';
import { trackCsvRowSchema } from './track.schema';

const albumSchemaPrimary = dbSchema
  .extend({
    name: z.string().min(1),
    releaseYear: z.coerce.number(),

    dataSource: z.enum(['csv']).optional(),
  })
  .strict();

export const albumSchema = albumSchemaPrimary.extend(trackCsvRowSchema.shape);
