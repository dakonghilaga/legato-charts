import { z } from 'zod';

import dbSchema from './db.schema';
import { trackCsvRowSchema } from './track.schema';

const albumSchemaPrimary = dbSchema
  .extend({
    name: z.string().min(1),
    releaseYear: z.coerce.number(),
    artistName: z.string().min(1),

    // TODO: Add denormalise data from artist schema
    artist: z.object({}).optional(),

    dataSource: z.enum(['csv']).optional(),
  })
  .strict();

export const albumSchema = albumSchemaPrimary.extend(trackCsvRowSchema.shape);
