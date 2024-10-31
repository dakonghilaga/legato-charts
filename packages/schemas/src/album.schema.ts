import { z } from 'zod';

import dbSchema from './db.schema';

export const albumSchema = dbSchema
  .extend({
    name: z.string().min(1),
    releaseYear: z.number(),

    // denormalise data from track schema
    tracks: z
      .array(
        z.object({
          _id: z.string().optional(),
          name: z.string().optional(),
          artistNameLabel: z.string().optional(),
        }),
      )
      .optional(),
  })
  .strict();
