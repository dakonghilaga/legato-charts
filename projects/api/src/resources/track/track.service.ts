import { Track } from 'app-types';
import _ from 'lodash';

import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { trackSchema } from 'schemas';
import { MongoSearchFilters } from 'types';

const service = db.createService<Track>(DATABASE_DOCUMENTS.TRACKS, {
  schemaValidator: (obj) => trackSchema.parseAsync(obj),
});

/**
 *
 * For text search, create an index in the 'tracks' collection:
 * See:
 * - https://www.mongodb.com/docs/manual/reference/operator/aggregation/search/
 * - https://www.mongodb.com/docs/atlas/atlas-search/tutorial/
 * - https://www.mongodb.com/docs/atlas/atlas-search/aggregation-stages/search/#aggregation-variable
 *
 * name: textSearch
 * index definition: {
 *   "mappings": {
 *     "dynamic": false,
 *     "fields": {
 *       "artistName": { // field name to search
 *         "type": "string",
 *         "indexOptions": "offsets",
 *         "store": true,
 *         "norms": "include"
 *       }
 *     }
 *   }
 * }
 * */
const listTracks = async ({ page, sort, filter, perPage }: MongoSearchFilters) => {
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

  // TODO: Move to a separate util or middleware
  // Start: match stage
  const allowedTextFilters = ['artistName']; // Define allowed text filters
  let buildTextSearchFilters: object = {};
  const buildMatchFilters: unknown[] = [];

  _.forEach(filter, (value, key) => {
    // If allowed, transform the search filter to search syntax
    if (_.includes(allowedTextFilters, key)) {
      // TODO: Improve: This is a simple text search
      // https://www.mongodb.com/docs/atlas/atlas-search/text/#std-label-text-ref
      buildTextSearchFilters = {
        $search: {
          index: 'textSearch',
          text: {
            path: key,
            query: value,
          },
        },
      };
    } else {
      // If not allowed, push the $match stage
      buildMatchFilters.push({ [key]: value });
    }
  });

  const useAndClause = buildMatchFilters.length > 1;

  const matchStage = {
    $match: useAndClause ? { $and: buildMatchFilters } : buildMatchFilters[0],
  };

  // unshift: move match stage to the beginning of the pipeline
  if (buildMatchFilters.length) {
    aggregationPipeline.unshift(matchStage);
  }

  // splice: text search stage must be the first in the pipeline
  if (!_.isEmpty(buildTextSearchFilters)) {
    aggregationPipeline.splice(0, 0, buildTextSearchFilters);
  }
  // End: match stage

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
