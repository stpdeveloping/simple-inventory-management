import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { env } from "../../../env";

export const getOptimizedDb = () => {
    const db = new Database(`${env.npm_package_name}.db`);
    db.pragma(`journal_mode = WAL`);
    return drizzle(db);
}