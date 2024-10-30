import { z } from 'zod';

import { artistSchema } from 'schemas';

export type Artist = z.infer<typeof artistSchema>;
