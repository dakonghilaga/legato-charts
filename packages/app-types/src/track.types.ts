import { z } from 'zod';

import { trackSchema } from 'schemas';

export type Track = z.infer<typeof trackSchema>;
