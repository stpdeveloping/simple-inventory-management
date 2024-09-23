import { productDbSchema } from "../productDbSchema";
import { ProductToFind } from "./ProductToFind";

export type ProductForStockUpdate = ProductToFind & {
    amount: typeof productDbSchema.$inferSelect[`stock`]
};