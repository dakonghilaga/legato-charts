import multer from '@koa/multer';

import { trackService } from 'resources/track';

import { fileImportService } from 'services';

import logger from 'logger';

import { AppKoaContext, AppRouter, Next } from 'types';

const upload = multer();

async function validator(ctx: AppKoaContext, next: Next) {
  const { file } = ctx.request;

  ctx.assertClientError(file, { global: 'File cannot be empty' });

  const supportedFileType = ['text/csv'].includes(file.mimetype);
  ctx.assertClientError(supportedFileType, { global: 'File type is not supported.' });

  const supportedFileSize = file.size <= 24000; // 24KB
  ctx.assertClientError(supportedFileSize, { global: 'File size is too big.' });

  await next();
}

type TrackCsvRow = {
  song: string;

  /* eslint-disable @typescript-eslint/naming-convention */
  artist_name_label: string;
  artist_main: string;
  artist_others: string;
  album_release_year: string;
  /* eslint-enable @typescript-eslint/naming-convention */

  album: string;
  writer: string;
} & {
  [k in `total_plays_month_${string}`]: string;
};

async function handler(ctx: AppKoaContext) {
  const { file } = ctx.request;

  const parsedTracksPromises = await fileImportService.importCsv(file);

  const parsedTracksRows = [];
  const savedTrackRows = [];

  for await (const csvRow of parsedTracksPromises) {
    const row = csvRow as TrackCsvRow;

    parsedTracksRows.push(row);

    const trackExists = await trackService.exists({
      name: row.song,
      artistNameLabel: row.artist_name_label,
      'dataSourceAttributes.album': row.album,
    });

    if (trackExists) {
      logger.info(`Track '${row.song}' exists, skipping...`);
    }

    if (!trackExists) {
      const { _id, name, artistNameLabel } = await trackService.insertOne({
        name: row.song,
        artistNameLabel: row.artist_name_label,
        dataSource: 'csv',
        dataSourceAttributes: row,
      });

      savedTrackRows.push({ _id, name, artistNameLabel });
    }
  }

  ctx.body = {
    count: savedTrackRows.length,
    metadata: {
      sourceCount: parsedTracksRows.length,
    },
    results: savedTrackRows,
  };
}

export default (router: AppRouter) => {
  router.post('/import/csv', upload.single('file'), validator, handler);
};
