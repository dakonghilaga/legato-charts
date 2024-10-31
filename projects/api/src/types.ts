import Router from '@koa/router';
import Koa, { Next, ParameterizedContext, Request } from 'koa';

export * from 'app-types';

export type CustomErrors = {
  [name: string]: string;
};

export interface AppKoaContext<T = unknown, R = unknown> extends ParameterizedContext {
  request: Request & R;
  validatedData: T & object;
  throwError: (message: string, status?: number) => never;
  assertError: (condition: unknown, message: string) => asserts condition;
  throwClientError: (errors: CustomErrors, status?: number) => never;
  assertClientError: (condition: unknown, errors: CustomErrors, status?: number) => asserts condition;
}

export class AppRouter extends Router<AppKoaContext> {}

export class AppKoa extends Koa<AppKoaContext> {}

export type AppRouterMiddleware = Router.Middleware<AppKoaContext>;

export type ValidationErrors = {
  [name: string]: string[] | string;
};

export { Next };

export type MongoSearchFilters = {
  page: number;
  sort: { [index: string]: number } | undefined;
  perPage: number;
  searchValue?: string | undefined;
};

export type TrackCsvRow = {
  song: string;

  /* eslint-disable @typescript-eslint/naming-convention */
  artist_name_label: string;
  artist_main: string;
  artist_others: string;
  album_release_year: string;
  year_counted: string;
  /* eslint-enable @typescript-eslint/naming-convention */

  album: string;
  writer: string;
} & {
  [k in `total_plays_month_${string}`]: string;
};
