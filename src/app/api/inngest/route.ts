import { serve } from 'inngest/next';

import { inngest } from '@/lib/inngest';
import { deleteExpiredFiles } from '@/lib/inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [deleteExpiredFiles]
});
