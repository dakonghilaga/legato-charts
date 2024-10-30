import { routeUtil } from 'utils';

import importCsv from './actions/import-csv';

const privateRoutes = routeUtil.getRoutes([importCsv]);

export default {
  privateRoutes,
};
