import {
  buildDateFilter,
  checkSupportedReport,
  getTrackStatsPipeline,
  trackStatsReports,
} from '../helpers/query/generate-track-stats.helpers';

jest.mock('resources/report', () => ({
  reportTrackPlayService: {
    trackStats: jest.fn(),
  },
}));

describe('Generate track reports helpers', () => {
  describe('buildDateFilter', () => {
    it('should return date filter with default year and precision', () => {
      const result = buildDateFilter({ month: 5 });
      expect(result).toEqual({
        'dateAttributes.month': 5,
        'dateAttributes.year': 2024,
        'dateAttributes.precision': 'month',
      });
    });

    it('should return date filter with specified year and precision', () => {
      const result = buildDateFilter({
        month: 5,
        year: 2023,
        precision: 'month',
      });

      expect(result).toEqual({
        'dateAttributes.month': 5,
        'dateAttributes.year': 2023,
        'dateAttributes.precision': 'month',
      });
    });
  });

  describe('trackStatsReports Methods', () => {
    it('should generate totalPlaysCount pipeline correctly', () => {
      const pipeline = trackStatsReports.totalPlaysCount({
        dateByPrecision: {
          month: 5,
        },
      });

      expect(pipeline).toEqual([
        {
          $match: {
            'dateAttributes.month': 5,
            'dateAttributes.year': 2024,
            'dateAttributes.precision': 'month',
          },
        },
        {
          $group: {
            _id: null,
            totalPlaysCount: {
              $sum: '$totalPlays',
            },
          },
        },
        {
          $project: { _id: 0 },
        },
      ]);
    });

    it('should generate mostPopularByTrackPlays pipeline correctly', () => {
      const pipeline = trackStatsReports.mostPopularByTrackPlays({
        dimension: 'track',
        dateByPrecision: {
          month: 5,
        },
      });

      expect(pipeline).toEqual([
        {
          $match: {
            'dateAttributes.month': 5,
            'dateAttributes.year': 2024,
            'dateAttributes.precision': 'month',
          },
        },
        {
          $group: {
            _id: { track: '$trackNameLabel' },
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
      ]);
    });
  });

  describe('checkSupportedReport', () => {
    it('should return true for supported report', () => {
      expect(checkSupportedReport('mostPopularByTrackPlays')).toBe(true);
    });

    it('should return false for unsupported report', () => {
      expect(checkSupportedReport('unsupportedReport')).toBe(false);
    });
  });

  describe('getTrackStatsPipeline', () => {
    it('should call correct method and return pipeline', () => {
      const result = getTrackStatsPipeline('totalPlaysCount', { dateByPrecision: { month: 5 } });
      expect(result).toEqual(expect.any(Array));
    });
  });
});
