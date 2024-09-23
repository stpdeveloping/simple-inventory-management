import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { productDbSchema } from "../product/productDbSchema";

export const orderDbSchema = sqliteTable(`orders`, {
    orderId: integer(`orderId`, { mode: `number` }).primaryKey(),
    customerId: integer(`customerId`).notNull(),
    productId: integer(`productId`).references(() => productDbSchema.id).notNull()
});