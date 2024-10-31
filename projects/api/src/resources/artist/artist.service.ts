import { Artist } from 'app-types';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { artistSchema } from 'schemas';

const service = db.createService<Artist>(DATABASE_DOCUMENTS.ARTISTS, {
  schemaValidator: (obj) => artistSchema.parseAsync(obj),
});

export default Object.assign(service, {});
