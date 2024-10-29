import { Database, IDocument, Service, ServiceOptions } from '@paralect/node-mongo';

import config from 'config';

import logger from 'logger';

const database = new Database(config.MONGO_URI, config.MONGO_DB_NAME, {
  retryWrites: true,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
});

try {
  logger.info(`Connecting to db: ${database.dbName} `);
  database.connect();
} finally {
  database.close();
}

class CustomService<T extends IDocument> extends Service<T> {
  // You can add new methods or override existing here
}

function createService<T extends IDocument>(collectionName: string, options: ServiceOptions = {}) {
  return new CustomService<T>(collectionName, database, options);
}

export default Object.assign(database, {
  createService,
});
