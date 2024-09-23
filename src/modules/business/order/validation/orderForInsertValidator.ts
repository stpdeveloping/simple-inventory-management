import vine from "@vinejs/vine";
import { getProductForStockUpdateValidationSchema } from "../../product/validation/getProductForStockUpdateValidationSchema";

export const orderForInsertValidator = vine.compile(vine.object({
    customerId: vine.number({ strict: true }).positive(),
    productId: getProductForStockUpdateValidationSchema().getProperties().id,
    amount: getProductForStockUpdateValidationSchema().getProperties().amount
}));