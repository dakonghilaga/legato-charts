import { File } from '@koa/multer';
import { parse } from 'csv-parse';

import logger from 'logger';

// TODO: Add validations requiring proper data shapes
// TODO: Support different data shapes
// TODO: Check benchmarks if requiring thousands/millions of rows
const importCsv = async (file: File) => {
  try {
    const { buffer } = file;
    const data = Buffer.from(buffer);

    // https://csv.js.org/parse/api/async_iterator/
    return parse(data, {
      columns: (header) => header.map((column: string) => column.toLowerCase()),
    });
  } catch (e) {
    logger.error(e);
    return [];
  }
};

export default { importCsv };
