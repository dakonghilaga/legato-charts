import multer from '@koa/multer';

import { fileImportService } from 'services';

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

async function handler(ctx: AppKoaContext) {
  const { file } = ctx.request;

  const parsedTracksPromises = await fileImportService.importCsv(file);

  const parsedTracksRows = [];

  for await (const row of parsedTracksPromises) {
    parsedTracksRows.push(row);
  }

  ctx.body = { count: parsedTracksRows.length, results: parsedTracksRows };
}

export default (router: AppRouter) => {
  router.post('/import/csv', upload.single('file'), validator, handler);
};
