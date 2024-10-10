import { productDbSchema } from "../productDbSchema";

export type ProductWithUpdatedStock =
    Pick<typeof productDbSchema.$inferSelect, `id` | `stock`>;