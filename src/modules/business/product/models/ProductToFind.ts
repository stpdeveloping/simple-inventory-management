import { productDbSchema } from "../productDbSchema";

export type ProductToFind = Pick<typeof productDbSchema.$inferSelect, `id`>;