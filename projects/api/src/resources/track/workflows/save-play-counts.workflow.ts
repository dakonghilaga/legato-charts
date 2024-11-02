import { reportTrackPlayService } from 'resources/report';

import logger from 'logger';

import { ReportTrackPlay, TrackCsvRowRaw } from 'types';

const PRECISION_MONTH_PREFIX = 'total_plays_month_';
const DATE_PRECISION = 'month';

// Saves play count data
const savePlayCountsWorkflow = async (row: TrackCsvRowRaw) => {
  for await (const [key, value] of Object.entries(row)) {
    if (key.includes(PRECISION_MONTH_PREFIX)) {
      const extractedMonth = key.replace(PRECISION_MONTH_PREFIX, '');
      const month = Number(extractedMonth);
      const year = Number(row.year_counted);
      const totalPlays = Number(value);

      const reportTrackExists = await reportTrackPlayService.findOne({
        trackNameLabel: row.song,
        albumNameLabel: row.album,
        dateAttributes: {
          month,
          year,
          precision: DATE_PRECISION,
        },
      });

      if (reportTrackExists) {
        logger.info(`Report for '${row.song}' exists, skipping...`);
      }

      if (!reportTrackExists) {
        const reportTrackPlayData: Partial<ReportTrackPlay> = {
          trackNameLabel: row.song,
          albumNameLabel: row.album,
          dateAttributes: {
            month,
            precision: DATE_PRECISION,
            year,
          },
          totalPlays,
          dataSource: 'csv',
          dataSourceAttributes: row,
        };

        await reportTrackPlayService.insertOne(reportTrackPlayData);
      }
    }
  }
};

export default savePlayCountsWorkflow;
