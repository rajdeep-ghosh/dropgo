import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const migrationClient = new Client({
  connectionString: process.env.DB_URL
});

async function main() {
  await migrationClient.connect();

  const db = drizzle(migrationClient);
  await migrate(db, { migrationsFolder: 'src/lib/db/migrations' });

  await migrationClient.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
