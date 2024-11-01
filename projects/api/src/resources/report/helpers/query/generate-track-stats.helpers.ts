/* eslint-disable @typescript-eslint/naming-convention */

const buildDateFilter = (month?: number, year = 2024, precision = 'month') => ({
  'dateAttributes.month': month,
  'dateAttributes.year': year,
  'dateAttributes.precision': precision,
});

type DateFilter = {
  month?: number;
  year?: number;
};

// TODO: Perhaps use a pipeline builder for more idiomatic query pipelines
// eg: https://www.npmjs.com/package/mongodb-pipeline-builder
const trackStatsReports = {
  // count overall total plays
  totalPlaysCount: ({ month, year }: DateFilter = {}) => {
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
    ] as unknown as [NonNullable<unknown>];

    if (month) {
      pipeline.unshift({ $match: buildDateFilter(month, year) });
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

  // Ensures types for the arguments for the chose `method`
  ...args: Parameters<(typeof trackStatsReports)[N]>
) {
  // Store the function from picked from `trackStatsMethods` via `methodName`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invokedMethod: (...args: any[]) => any = trackStatsReports[methodName as keyof typeof trackStatsReports];

  // Invoke with the spread `args` with typed result consists of array with variable size
  return invokedMethod(...args) as [object, ...object[]];
}

export { checkSupportedReport, getTrackStatsPipeline };
