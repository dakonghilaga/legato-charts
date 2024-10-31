import { Writer } from 'app-types';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { writerSchema } from 'schemas';

const service = db.createService<Writer>(DATABASE_DOCUMENTS.WRITERS, {
  schemaValidator: (obj) => writerSchema.parseAsync(obj),
});

export default Object.assign(service, {});
