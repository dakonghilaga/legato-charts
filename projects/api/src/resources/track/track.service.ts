import { Track } from 'app-types';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { trackSchema } from 'schemas';

const service = db.createService<Track>(DATABASE_DOCUMENTS.TRACKS, {
  schemaValidator: (obj) => trackSchema.parseAsync(obj),
});

export default Object.assign(service, {});
