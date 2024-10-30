import { z } from 'zod';

import dbSchema from './db.schema';

export const reportTrackPlaySchema = dbSchema
  .extend({
    // denormalise data from track schema
    track: z.object({
      _id: z.string(),
      name: z.string(),
    }),

    // denormalise data from album schema
    album: z
      .object({
        _id: z.string().optional(),
        name: z.string().optional(),
        releaseYear: z.number().optional(),
      })
      .optional(),

    dateAttributes: z
      .object({
        timestamp: z.date().optional(),
        day: z.number().optional(),
        month: z.number().optional(),
        year: z.number().optional(),
        precision: z.enum(['timestamp', 'day', 'month', 'year']).optional(),
      })
      .optional(),

    totalPlays: z
      .number()
      .safe() // within MIN_SAFE_INTEGER and MAX_SAFE_INTEGER
      .nonnegative(), //  >= 0
  })
  .strict();
