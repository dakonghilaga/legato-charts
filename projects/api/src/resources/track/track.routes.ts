import { routeUtil } from 'utils';

import importCsv from './actions/import-csv';
import list from './actions/list';

const privateRoutes = routeUtil.getRoutes([importCsv, list]);

export default {
  privateRoutes,
};
