import { reportTrackPlayService } from 'resources/report';

import { AppKoaContext, AppRouter, Next } from 'types';

import { checkSupportedReport, getTrackStatsPipeline } from '../../helpers/query/generate-track-stats.helpers';

type ReportsTrackStatsRequestBody = {
  reportName: string;
  filter: {
    dateByPrecision: {
      month: number;
      precision: 'month';
    };
  };
};

// TODO: Add more robust validator via zod
async function validator(ctx: AppKoaContext, next: Next) {
  const isRequestContentTypeSupported = ctx.is('application/json');
  ctx.assertClientError(isRequestContentTypeSupported, { global: 'Content type is not supported.' }, 415);

  const { reportName } = (ctx.request.body as ReportsTrackStatsRequestBody) || {};
  ctx.assertClientError(!!reportName, { global: '`reportName` is required' });

  const isSupportedReport = checkSupportedReport(reportName);

  ctx.assertClientError(isSupportedReport, { global: `Report '${reportName}' is currently not supported.` });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { reportName, filter } = ctx.request.body as ReportsTrackStatsRequestBody;

  const pipeline = getTrackStatsPipeline(reportName, filter?.dateByPrecision);

  // Extract the result object from aggregation result array
  const [result] = await reportTrackPlayService.trackStats(pipeline);

  // Returns the reportName key with value 0 if no results found
  // TODO: Standardised report results structure
  ctx.body = result || { [reportName]: 0 };
}

export default (router: AppRouter) => {
  router.post('/track/stats', validator, handler);
};
