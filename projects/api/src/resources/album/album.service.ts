import { Album } from 'app-types';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { albumSchema } from 'schemas';

const service = db.createService<Album>(DATABASE_DOCUMENTS.ALBUMS, {
  schemaValidator: (obj) => albumSchema.parseAsync(obj),
});

export default Object.assign(service, {});
