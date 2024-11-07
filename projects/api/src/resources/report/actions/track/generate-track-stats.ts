import _ from 'lodash';
import { z } from 'zod';

import { reportTrackPlayService } from 'resources/report';

import { validateMiddleware } from 'middlewares';

import { AppKoaContext, AppRouter, Next } from 'types';

import { checkSupportedReport, getTrackStatsPipeline } from '../../helpers/query/generate-track-stats.helpers';

const REPORTS_WITH_DIMENSION_FILTER = ['mostPopularByTrackPlays'];

const schema = z
  .object({
    reportName: z.string(),
    filter: z
      .object({
        dimension: z.enum(['album', 'artist', 'track'], { message: 'Dimension is not supported' }).optional(),
        dateByPrecision: z
          .object({
            month: z.coerce.number().min(1).max(12).optional(),
            year: z.coerce.number().min(1877).optional(), // start of the acoustic era?
            precision: z.enum(['month'], { message: 'Precision type is not supported' }).optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .refine((fields) => {
    // filter.dimension must be required for certain reports
    const mustHaveDimension = _.includes(REPORTS_WITH_DIMENSION_FILTER, fields.reportName);
    const missingDimension = !fields?.filter?.dimension;

    return !(mustHaveDimension && missingDimension);
  }, 'Dimension is required');

interface ValidatedData extends z.infer<typeof schema> {
  pipeline: [object, ...object[]];
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { reportName, filter } = (ctx.request.body as ValidatedData) || {};

  const isSupportedReport = checkSupportedReport(reportName);

  ctx.assertClientError(isSupportedReport, { global: `Report '${reportName}' is currently not supported.` });

  const pipeline = getTrackStatsPipeline(reportName, filter);

  if (_.isEmpty(pipeline)) {
    ctx.body = {
      reportName,
      results: [],
    };

    return;
  }

  ctx.validatedData.pipeline = pipeline;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { pipeline, reportName } = ctx.validatedData;

  // Extract the result object from aggregation result array
  const results = await reportTrackPlayService.trackStats(pipeline);

  // TODO: Improve report results structure
  ctx.body = {
    reportName,
    results,
  };
}

export default (router: AppRouter) => {
  router.post('/track/stats', validateMiddleware(schema), validator, handler);
};
