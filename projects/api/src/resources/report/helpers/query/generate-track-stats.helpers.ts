interface DateFilter {
  month?: number;
  year?: number;
  precision?: string;
}

interface Filters {
  dateByPrecision?: DateFilter;
  dimension?: string;
}

interface DimensionKeys {
  artist: object;
  track: object;
  album: object;
}

const buildDateFilter = ({ month, year = 2024, precision = 'month' }: DateFilter) => ({
  'dateAttributes.month': month,
  'dateAttributes.year': year,
  'dateAttributes.precision': precision,
});

const dimensionKeys: DimensionKeys = {
  artist: { artist: '$artistName' },
  track: { track: '$trackNameLabel' },
  album: { album: '$albumName' },
};

// TODO: Perhaps use a pipeline builder for more idiomatic query pipelines
// eg: https://www.npmjs.com/package/mongodb-pipeline-builder
const trackStatsReports = {
  // count overall total plays
  totalPlaysCount: ({ dateByPrecision }: Filters = {}) => {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalPlaysCount: {
            $sum: '$totalPlays',
          },
        },
      },
      { $project: { _id: 0 } },
    ] as unknown as [NonNullable<unknown>]; // Type so we can push any objects in the pipeline

    if (dateByPrecision) {
      pipeline.unshift({ $match: buildDateFilter(dateByPrecision) });
    }

    return pipeline;
  },

  mostPopularByTrackPlays: ({ dimension, dateByPrecision }: Filters = {}) => {
    if (!dimension) {
      return [];
    }

    const getGroupId = dimensionKeys[dimension as keyof DimensionKeys];

    const pipeline = [
      {
        $group: {
          _id: getGroupId,
          totalPlaysCount: {
            $sum: '$totalPlays',
          },
        },
      },
      {
        $sort: {
          totalPlaysCount: -1,
        },
      },
      {
        $project: {
          _id: 0,
          track: '$_id.track',
          album: '$_id.album',
          artist: '$_id.artist',
          totalPlaysCount: 1,
        },
      },
    ] as unknown as [NonNullable<unknown>];

    if (dateByPrecision) {
      pipeline.unshift({ $match: buildDateFilter(dateByPrecision) });
    }

    return pipeline;
  },
};

const checkSupportedReport = (reportName: string) => Object.hasOwn(trackStatsReports, reportName);

/**
 * Define a generic getTrackStatsPipeline() that accepts the method name and arguments.
 * Generic type `N` extends a union of keys of the `trackStatsMethods` object.
 * `N` ensures the `methodName` is one of the key of `trackStatsMethods`.
 */
function getTrackStatsPipeline<N extends keyof typeof trackStatsReports>(
  methodName: string,

  // Ensures types for the arguments of the chosen `method`
  ...args: Parameters<(typeof trackStatsReports)[N]>
) {
  // Store the function from picked from `trackStatsMethods` via `methodName`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invokedMethod: (...args: any[]) => any = trackStatsReports[methodName as keyof typeof trackStatsReports];

  // Invoke with the spread `args` with typed result consists of array with variable size
  return invokedMethod(...args) as [object, ...object[]];
}

export { checkSupportedReport, getTrackStatsPipeline };
