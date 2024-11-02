import { z } from 'zod';

import dbSchema from './db.schema';

export const trackCsvRowSchema = z
  .object({
    dataSourceAttributes: z
      .object({
        song: z.string().optional(),
        artist_name_label: z.string().optional(),
        artist_main: z.string().optional(),
        artist_others: z.string().optional(),
        album_release_year: z.coerce.number().optional(),
        year_counted: z.coerce.number().optional(),
        album: z.string().optional(),
        writer: z.string().optional(),
      })
      .optional(),
  })
  .strict();

const trackSPrimarySchema = dbSchema
  .extend({
    name: z.string().min(1),
    artistNameLabel: z.string().min(1), // artist name(s) for display
    albumName: z.string().optional(),
    artistName: z.string().min(1),
    releaseYear: z.coerce.number().optional(),

    // TODO: Add denormalise data from album schema
    album: z.object({}).optional(),

    // TODO: Add  denormalise data from artist schema
    mainArtists: z.array(z.object({}).optional()).optional(),

    // TODO: Add denormalise data from artist schema
    otherArtists: z.array(z.object({}).optional()).optional(),

    dataSource: z.enum(['csv']).optional(),
  })
  .strict();

export const trackSchema = trackSPrimarySchema.extend(trackCsvRowSchema.shape);
