import { Track } from 'app-types';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { trackSchema } from 'schemas';
import { MongoSearchFilters } from 'types';

const service = db.createService<Track>(DATABASE_DOCUMENTS.TRACKS, {
  schemaValidator: (obj) => trackSchema.parseAsync(obj),
});

const listTracks = async ({ page = 1, sort, filter, perPage = 10 }: MongoSearchFilters) => {
  const aggregationPipeline = [
    // sort stage
    { $sort: sort || { releaseYear: -1 } },

    // count: should be before skip and limit
    { $setWindowFields: { output: { currentCount: { $count: {} } } } },

    // skip stage
    { $skip: (page - 1) * perPage },
    { $limit: perPage },

    // set fields to be returned
    {
      $project: {
        _id: 1,
        name: 1,
        artistNameLabel: 1,
        artistName: 1,
        albumName: 1,
        releaseYear: 1,
        album: {
          _id: 1,
          name: 1,
          releaseYear: 1,
        },
        metadata: {
          currentCount: '$currentCount',
        },
      },
    },
  ] as unknown as [NonNullable<unknown>];

  // match stage
  const matchStage = {
    $match: filter,
  };

  // match stage must be in the start of the pipeline
  if (filter) {
    aggregationPipeline.unshift(matchStage);
  }

  const results = await service.aggregate(aggregationPipeline);

  const count = results[0]?.metadata.currentCount;
  const pagesCount: number = Math.floor(count / perPage) || 1;

  return {
    results,
    count,
    pagesCount,
  };
};

export default Object.assign(service, { listTracks });
