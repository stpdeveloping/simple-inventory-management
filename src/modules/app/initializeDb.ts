import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { env } from "../../../env";
import { db } from '../shared/db';

export const initializeDb = async () =>
    await migrate(db, { migrationsFolder: env.DRIZZLE_LOCATION });