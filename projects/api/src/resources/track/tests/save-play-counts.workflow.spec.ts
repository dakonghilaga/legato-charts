import { reportTrackPlayService } from 'resources/report';

import { TrackCsvRowRaw } from 'types';

import savePlayCountsWorkflow from '../workflows/save-play-counts.workflow';

jest.mock('resources/report', () => ({
  reportTrackPlayService: {
    findOne: jest.fn(),
    insertOne: jest.fn(),
  },
}));

const sampleCsvRow: TrackCsvRowRaw = {
  song: '22',
  artist_name_label: 'Taylor Swift',
  artist_main: 'Taylor Swift',
  artist_others: '',
  writer: 'Taylor Swift\nMax Martin\nShellback',
  album: 'Red',
  album_release_year: 2012,
  total_plays_month_6: 27,
  total_plays_month_7: 30,
  total_plays_month_8: 32,
  year_counted: 2024,
};

describe('savePlayCountsWorkflow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should skip insertion if the track already exists', async () => {
    (reportTrackPlayService.findOne as jest.Mock).mockResolvedValue(true);

    await savePlayCountsWorkflow(sampleCsvRow);

    expect(reportTrackPlayService.insertOne).not.toHaveBeenCalled();
  });

  it('should insert track reported play counts per month provided from each row', async () => {
    (reportTrackPlayService.findOne as jest.Mock).mockResolvedValue(false);

    await savePlayCountsWorkflow(sampleCsvRow);

    // since we have 3 months in the sampleRow
    expect(reportTrackPlayService.insertOne).toHaveBeenCalledTimes(3);
  });

  it('should process and insert the track detail and play count per month', async () => {
    (reportTrackPlayService.findOne as jest.Mock).mockResolvedValue(false);

    await savePlayCountsWorkflow(sampleCsvRow);

    expect(reportTrackPlayService.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        trackNameLabel: '22',
        albumName: 'Red',
        artistName: 'Taylor Swift',
        dateAttributes: {
          month: 6,
          year: 2024,
          precision: 'month',
        },
        totalPlays: 27,
        dataSource: 'csv',
      }),
    );

    expect(reportTrackPlayService.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        trackNameLabel: '22',
        albumName: 'Red',
        artistName: 'Taylor Swift',
        dateAttributes: {
          month: 7,
          year: 2024,
          precision: 'month',
        },
        totalPlays: 30,
        dataSource: 'csv',
      }),
    );

    expect(reportTrackPlayService.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        trackNameLabel: '22',
        albumName: 'Red',
        artistName: 'Taylor Swift',
        dateAttributes: {
          month: 8,
          year: 2024,
          precision: 'month',
        },
        totalPlays: 32,
        dataSource: 'csv',
      }),
    );
  });
});
