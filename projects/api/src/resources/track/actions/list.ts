import { z } from 'zod';

import { trackService } from 'resources/track';

import { validateMiddleware } from 'middlewares';
import { dbUtil } from 'utils';

import { paginationSchema } from 'schemas';
import { AppKoaContext, AppRouter } from 'types';

const schema = paginationSchema.extend({
  sort: z
    .object({
      releaseYear: z
        .preprocess((sortOrder) => dbUtil.sortOrderStringToNumber(<string>sortOrder), z.number())
        .optional(),
      albumName: z.preprocess((sortOrder) => dbUtil.sortOrderStringToNumber(<string>sortOrder), z.number()).optional(),
      artistName: z.preprocess((sortOrder) => dbUtil.sortOrderStringToNumber(<string>sortOrder), z.number()).optional(),
    })
    .optional(),
  filter: z
    .object({
      releaseYear: z.coerce.number().optional(),
      artistName: z.coerce.string().optional(),
    })
    .optional(),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { page, sort, filter, perPage } = ctx.validatedData;

  ctx.body = await trackService.listTracks({ page, sort, filter, perPage });
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), handler);
};
