import vine from "@vinejs/vine";
import { getProductForStockUpdateValidationSchema } from "../../product/validation/getProductForStockUpdateValidationSchema";

export const orderWithProductsValidator = vine.compile(vine.object({
    customerId: vine.number({ strict: true }).positive(),
    products: vine.array(getProductForStockUpdateValidationSchema())
}));