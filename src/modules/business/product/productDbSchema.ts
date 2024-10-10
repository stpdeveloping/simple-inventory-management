import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const productDbSchema = sqliteTable(`products`, {
    id: integer(`id`, { mode: `number` }).primaryKey(),
    name: text(`name`).notNull(),
    description: text(`description`).notNull(),
    price: real(`price`).notNull(),
    stock: integer(`stock`).notNull()
});