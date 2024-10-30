import { z } from 'zod';

import { reportTrackPlaySchema } from 'schemas';

export type ReportTrackPlay = z.infer<typeof reportTrackPlaySchema>;
