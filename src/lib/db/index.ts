import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

const queryClient = neon(process.env.DB_POOL_URL);

const db = drizzle(queryClient, { schema });

export default db;
