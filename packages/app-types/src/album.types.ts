import { z } from 'zod';

import { albumSchema } from 'schemas';

export type Album = z.infer<typeof albumSchema>;
