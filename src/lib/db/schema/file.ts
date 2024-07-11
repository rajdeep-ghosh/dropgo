import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';

const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  size: integer('size').notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  key: text('key').unique().notNull(),
  expiresAt: timestamp('expires_at')
    .notNull()
    .$defaultFn(() => new Date(Date.now() + 24 * 60 * 60 * 1000)), // +24 hrs
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export default files;
