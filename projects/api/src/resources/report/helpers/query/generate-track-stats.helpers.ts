/* eslint-disable @typescript-eslint/naming-convention */
const trackStatsMethods = {
  totalPlaysCount: () => [
    {
      $group: {
        _id: null,
        totalPlaysCount: {
          $sum: '$totalPlays',
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ],
};

/**
 * Define a generic getTrackStatsPipeline() that accepts the method name and arguments.
 * Generic type `N` extends a union of keys of the `trackStatsMethods` object.
 * `N` ensures the `methodName` is one of the key of `trackStatsMethods`.
 */
function getTrackStatsPipeline<N extends keyof typeof trackStatsMethods>(
  methodName: string,

  // Ensures types for the arguments for the chose `method`
  ...args: Parameters<(typeof trackStatsMethods)[N]>
) {
  // Store the function from picked from `trackStatsMethods` via `methodName`
  const invokedMethod: (...args: unknown[]) => unknown =
    trackStatsMethods[methodName as keyof typeof trackStatsMethods];

  // Invoke with the spread `args` with typed result consists of array with variable size
  return invokedMethod(...args) as [object, ...object[]];
}

export { getTrackStatsPipeline, trackStatsMethods };
