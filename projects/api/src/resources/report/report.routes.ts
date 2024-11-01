import { routeUtil } from 'utils';

import generateTrackStats from './actions/track/generate-track-stats';

const privateRoutes = routeUtil.getRoutes([generateTrackStats]);

export default {
  privateRoutes,
};
