import { createConsoleLogger } from 'app-utils';

import config from 'config';

const consoleLogger = createConsoleLogger(config?.IS_DEV ?? process.env.APP_ENV === 'development');

global.logger = consoleLogger;

export default consoleLogger;
