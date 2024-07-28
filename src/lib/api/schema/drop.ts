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

const updateFileReqSchema = z.object({
  id: z.string().uuid('Invalid id'),
  success: z.boolean()
});

const getFileReqSchema = z.string().uuid('Invalid id');

export { createFileReqSchema, updateFileReqSchema, getFileReqSchema };
