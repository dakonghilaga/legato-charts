import { z } from 'zod';

import dbSchema from './db.schema';

export const trackSchema = dbSchema
  .extend({
    name: z.string().min(1),
    artistNameLabel: z.string().min(1), // artist name(s) for display
    albumNameLabel: z.string().min(1), // album name(s) for display

    // denormalise data from album schema
    album: z
      .object({
        _id: z.string().optional(),
        name: z.string().optional(),
        releaseYear: z.number().optional(),
      })
      .optional(),

    // denormalise data from artist schema
    mainArtists: z
      .array(
        z.object({
          _id: z.string().optional(),
          name: z.string().optional(),
        }),
      )
      .optional(),

    otherArtists: z
      .array(
        z.object({
          _id: z.string().optional(),
          name: z.string().optional(),
        }),
      )
      .optional(),

    dataSource: z.enum(['csv']).optional(),

    // TODO: Preprocess types depending on data source value
    dataSourceAttributes: z.record(z.string()),
  })
  .strict();
