import { eq, lt, or, sql } from 'drizzle-orm';

import { inngest } from '@/lib/inngest';
import db from '@/lib/db';
import { filesTable } from '@/lib/db/schema';

export const deleteExpiredFiles = inngest.createFunction(
  {
    id: 'delete-expired-files',
    name: 'Delete Expired Files',
    triggers: {
      cron: 'TZ=Asia/Kolkata 0 */3 * * *'
    }
  },
  async ({ step }) => {
    const deletedFileIds = await step.run(
      'process-delete-expired-files',
      async () => {
        return await db
          .delete(filesTable)
          .where(
            or(
              lt(filesTable.expiresAt, sql`now()`),
              eq(filesTable.uploadStatus, 'UPLOADING')
            )
          )
          .returning({ id: filesTable.id });
      }
    );

    return {
      message: 'Task complete',
      ids: deletedFileIds.map((file) => file.id)
    };
  }
);
