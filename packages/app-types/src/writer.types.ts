import { z } from 'zod';

import { writerSchema } from 'schemas';

export type Writer = z.infer<typeof writerSchema>;
