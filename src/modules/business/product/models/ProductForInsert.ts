import { productDbSchema } from "../productDbSchema";

export type ProductForInsert = Omit<typeof productDbSchema.$inferInsert, `id`>;