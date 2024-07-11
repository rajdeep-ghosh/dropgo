import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema';

const queryClient = new Pool({
  connectionString: process.env.DB_POOL_URL
});

const db = drizzle(queryClient, { schema });

export default db;
