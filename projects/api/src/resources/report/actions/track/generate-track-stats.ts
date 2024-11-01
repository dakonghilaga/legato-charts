import { reportTrackPlayService } from 'resources/report';

import { AppKoaContext, AppRouter, Next } from 'types';

import { getTrackStatsPipeline, trackStatsMethods } from '../../helpers/query/generate-track-stats.helpers';

type ReportsTrackStatsRequestBody = {
  reportName: string;
};

async function validator(ctx: AppKoaContext, next: Next) {
  const isRequestContentTypeSupported = ctx.is('application/json');
  ctx.assertClientError(isRequestContentTypeSupported, { global: 'Content type is not supported.' }, 415);

  const { reportName } = ctx.request.body as ReportsTrackStatsRequestBody;

  const isSupportedMetrics = Object.hasOwn(trackStatsMethods, reportName);

  ctx.assertClientError(isSupportedMetrics, { global: 'Report name is not supported.' });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { reportName } = ctx.request.body as ReportsTrackStatsRequestBody;

  const report = getTrackStatsPipeline(reportName);

  const results = await reportTrackPlayService.trackStats(report);
  ctx.body = {
    results,
  };
}

export default (router: AppRouter) => {
  router.post('/track/stats', validator, handler);
};
