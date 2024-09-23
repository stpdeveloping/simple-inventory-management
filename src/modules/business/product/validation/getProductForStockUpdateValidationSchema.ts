import vine from "@vinejs/vine";
import { getProductValidationSchema } from "./getProductValidationSchema";

export const getProductForStockUpdateValidationSchema = () => vine.object({
    id: vine.number({ strict: true }).positive().min(1),
    amount: getProductValidationSchema().getProperties().stock.min(1)
});