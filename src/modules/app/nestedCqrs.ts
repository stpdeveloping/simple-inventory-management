import { Command, createCqrs, Query } from "functional-cqrs";
import { db } from "../shared/db";
import { sellProductCommandName } from "../business/product/command-names/sellProductCommandName";
import { getCommandBus } from "../shared/getCommandBus";
import { orderDbSchema } from "../business/order/orderDbSchema";
import { getProductQueryName } from "../business/product/query-names/getProductQueryName";
import { productDbSchema } from "../business/product/productDbSchema";
import { eq } from "drizzle-orm";
import { ProductToFind } from "../business/product/models/ProductToFind";
import { ExpressError } from "./ExpressError";
import httpStatus from "http-status";
import { updateProductFromOrder } from "../business/product/command-names/updateProductFromOrder";
import { ProductFromOrder } from "../business/product/models/ProductFromOrder";
import { SuccessfulProductFromOrder } from "../business/product/models/SuccessfulProductFromOrder";

export const nestedCqrs = createCqrs({
    queryHandlers: {
        [getProductQueryName]: async ({ payload }: Query<ProductToFind>) => {
            const queryResult = await db.select().from(productDbSchema).where(
                eq(productDbSchema.id, payload.id));
            const selectedProduct = queryResult[0];
            if (!selectedProduct)
                throw <ExpressError<string>>{
                    status: httpStatus.NOT_FOUND, body: `Product`}
            return selectedProduct;
        }
    },
    commandHandlers: {
        [updateProductFromOrder]: async ({ payload }: Command<ProductFromOrder>) => {
            const { stock } = await getCommandBus().execute({
                name: sellProductCommandName,
                payload: payload
            });
            const insertResult = await db.insert(orderDbSchema).values({
                ...payload,
                productId: payload.productId
            }).returning(
                { orderId: orderDbSchema.orderId, productId: orderDbSchema.productId });
            const { orderId, productId } = insertResult[0];
            return <SuccessfulProductFromOrder>{ orderId, productId, stock };
        }
    }
});