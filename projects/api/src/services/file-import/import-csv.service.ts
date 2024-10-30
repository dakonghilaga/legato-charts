import { File } from '@koa/multer';
import { parse } from 'csv-parse';

import logger from 'logger';

const importCsv = async (file: File) => {
  try {
    const { buffer } = file;
    const data = Buffer.from(buffer);

    return parse(data, {
      columns: (header) => header.map((column: string) => column.toLowerCase()),
    });
  } catch (e) {
    logger.error(e);
    return [];
  }
};

export default { importCsv };
