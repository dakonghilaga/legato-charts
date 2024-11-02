import multer from '@koa/multer';

import { trackService } from 'resources/track';

import { csvFileImportService } from 'services';

import logger from 'logger';

import { AppKoaContext, AppRouter, Next } from 'types';

import savePlayCountsWorkflow from '../workflows/save-play-counts.workflow';
import saveTrackReferencesWorkflow from '../workflows/save-track-references.workflow';

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

async function handler(ctx: AppKoaContext) {
  const { file } = ctx.request;

  const parsedTracksPromises = await csvFileImportService.importCsv(file);

  const parsedTracksRows = [];

  for await (const csvRow of parsedTracksPromises) {
    const row = csvRow;

    const trackExists = await trackService.exists({
      name: row.song,
      artistNameLabel: row.artist_name_label,
      'dataSourceAttributes.album': row.album,
    });

    if (trackExists) {
      logger.info(`Track '${row.song}' exists, skipping...`);
    }

    if (!trackExists) {
      await trackService.insertOne({
        name: row.song,
        artistNameLabel: row.artist_name_label,
        albumNameLabel: row.album,
        dataSource: 'csv',
        dataSourceAttributes: row,
      });
    }

    await saveTrackReferencesWorkflow(row);

    await savePlayCountsWorkflow(row);

    parsedTracksRows.push(row);
  }

  ctx.body = {
    count: parsedTracksRows.length,
    results: parsedTracksRows,
  };
}

export default (router: AppRouter) => {
  router.post('/import/csv', upload.single('file'), validator, handler);
};
