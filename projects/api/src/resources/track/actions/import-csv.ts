import multer from '@koa/multer';

import { fileImportService } from 'services';

import { AppKoaContext, AppRouter, Next } from 'types';

const upload = multer();

async function validator(ctx: AppKoaContext, next: Next) {
  const { file } = ctx.request;

  const supportedFileType = ['text/csv'].includes(file.mimetype);

  const supportedFileSize = file.size <= 24000; // 24KB

  ctx.assertClientError(supportedFileSize, { global: 'File size is too big.' });
  ctx.assertClientError(supportedFileType, { global: 'File type is not supported.' });
  ctx.assertClientError(file, { global: 'File cannot be empty' });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { file } = ctx.request;

  const parsedRowsPromises = await fileImportService.importCsv(file);

  const parsedRows = [];

  for await (const row of parsedRowsPromises) {
    parsedRows.push(row);
  }

  ctx.body = { count: parsedRows.length, results: parsedRows };
}

export default (router: AppRouter) => {
  router.post('/import/csv', upload.single('file'), validator, handler);
};
