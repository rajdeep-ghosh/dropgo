import { z } from 'zod';

import { maxFileSize } from '@/lib/constants';
import { formatBytes } from '@/lib/utils';

const createFileReqSchema = z.object({
  name: z.string().min(1, 'Cannot be empty'),
  size: z
    .number()
    .int()
    .positive('Invalid')
    .max(
      maxFileSize + 1,
      `Exceeds the maximum limit of ${formatBytes(maxFileSize)}`
    ),
  type: z.string().min(1, 'Not supported')
});

const getFileReqSchema = z.string().uuid('Invalid id');

export { createFileReqSchema, getFileReqSchema };
