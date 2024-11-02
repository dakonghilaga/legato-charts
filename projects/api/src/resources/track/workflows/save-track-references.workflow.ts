import { albumService } from 'resources/album';
import { artistService } from 'resources/artist';
import { writerService } from 'resources/writer';

import db from 'db';

import logger from 'logger';

import { TrackCsvRowRaw } from 'types';

/**
 * Save to DB the track's referenced album, artist, writer
 * Uses MongoDB transactions https://www.mongodb.com/docs/manual/core/transactions/
 * Via: https://www.npmjs.com/package/@paralect/node-mongo#transactions-api
 *
 * TODO: Should separate each saves to a more testable structure
 * TODO: Should be a separate service / worker
 */
const saveTrackReferencesWorkflow = async (row: TrackCsvRowRaw) => {
  /** Save Album * */
  await db.withTransaction(async (session) => {
    const albumExists = await albumService.findOne(
      {
        name: row.album,
        releaseYear: Number(row.album_release_year),
        'dataSourceAttributes.artist_main': row.artist_main,
      },
      {},
      { session },
    );

    if (albumExists) {
      logger.info(`Album '${row.album}' exists, skipping...`);
    }

    if (!albumExists) {
      await albumService.insertOne(
        {
          name: row.album,
          artistName: row.artist_main,
          releaseYear: Number(row.album_release_year),
          dataSource: 'csv',
          dataSourceAttributes: row,
        },
        {},
        { session },
      );
    }
  });

  /** Save Artist * */
  const mainArtists = row.artist_main.split('\n').filter((i: string) => i);
  const otherArtists = row.artist_others.split('\n').filter((i: string) => i);
  const artists = Array.from(new Set([...mainArtists, ...otherArtists])); // merge names, remove duplicates

  await Promise.all(
    artists.map(async (artistName) => {
      await db.withTransaction(async (session) => {
        const artistExists = await artistService.exists({
          name: artistName,
        });

        if (artistExists) {
          logger.info(`Artist '${artistName}' exists, skipping...`);
        }

        if (!artistExists) {
          // eslint-disable-next-line no-await-in-loop
          await artistService.insertOne(
            {
              name: artistName,
              dataSource: 'csv',
              dataSourceAttributes: row,
            },
            {},
            { session },
          );
        }
      });
    }),
  );

  /** Save Writer * */
  const writers = Array.from(new Set(row.writer.split('\n').filter((i) => i))); // remove duplicates
  await Promise.all(
    writers.map(async (writerName) => {
      await db.withTransaction(async (session) => {
        const writerExists = await writerService.exists(
          {
            name: writerName,
          },
          {},
        );

        if (writerExists) {
          logger.info(`Writer '${writerName}' exists, skipping...`);
        }

        if (!writerExists) {
          await writerService.insertOne(
            {
              name: writerName,
              dataSource: 'csv',
              dataSourceAttributes: row,
            },
            {},
            { session },
          );
        }
      });
    }),
  );
};

export default saveTrackReferencesWorkflow;
