import { Database } from '@paralect/node-mongo';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { trackSchema } from 'schemas';
import { Track } from 'types';

/**
 * jest-mongodb sets the process.env.MONGO_URL for convenience,
 * but using of global.__MONGO_URI__ is preferable.
 * See: https://github.com/shelfio/jest-mongodb
 */
const db = new Database(process.env.MONGO_URL as string);

const trackService = db.createService<Track>(DATABASE_DOCUMENTS.TRACKS, {
  schemaValidator: (obj) => trackSchema.parseAsync(obj),
});

describe('Track service', () => {
  beforeAll(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await trackService.deleteMany({});
  });

  it('should return standard response object if no tracks data found', async () => {
    const tracks = await trackService.find({}, {});

    expect(tracks).not.toBeNull();
    expect(tracks).toMatchObject({ pagesCount: 1, results: [], count: 0 });
  });

  afterAll(async () => {
    await db.close();
  });
});
