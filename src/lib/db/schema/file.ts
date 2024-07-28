import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';

const uploadStatusEnum = pgEnum('upload_status_enum', [
  'UPLOADING',
  'UPLOADED'
]);

const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  size: integer('size').notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  key: text('key').unique().notNull(),
  uploadStatus: uploadStatusEnum('upload_status')
    .notNull()
    .default('UPLOADING'),
  expiresAt: timestamp('expires_at')
    .notNull()
    .$defaultFn(() => new Date(Date.now() + 24 * 60 * 60 * 1000)), // +24 hrs
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export { uploadStatusEnum };
export default files;
