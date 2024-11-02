import { z } from 'zod';

import dbSchema from './db.schema';
import { trackCsvRowSchema } from './track.schema';

const reportTrackPlaySchemaPrimary = dbSchema
  .extend({
    trackNameLabel: z.string().min(1), // artist name(s) for display
    albumName: z.string().min(1),
    artistName: z.string().min(1),

    // TODO: Add denormalise data from track schema
    track: z
      .object({
        _id: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),

    // TODO: Add denormalise data from album schema
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

    dataSource: z.enum(['csv']).optional(),
  })
  .strict();

export const reportTrackPlaySchema = reportTrackPlaySchemaPrimary.extend(trackCsvRowSchema.shape);
