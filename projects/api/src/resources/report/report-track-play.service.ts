import { ReportTrackPlay } from 'app-types';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { reportTrackPlaySchema } from 'schemas';

const service = db.createService<ReportTrackPlay>(DATABASE_DOCUMENTS.REPORTS_TRACK_PLAY, {
  schemaValidator: (obj) => reportTrackPlaySchema.parseAsync(obj),
});

export default Object.assign(service, {});
