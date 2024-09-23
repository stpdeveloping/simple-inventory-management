import { Command, createCqrs } from "functional-cqrs";
import { db } from "../shared/db";
import { productDbSchema } from "../business/product/productDbSchema";
import { getProductsQueryName } from "../business/product/query-names/getProductsQueryName";
import { addProductCommandName } from "../business/product/command-names/addProductCommandName";
import { ProductForInsert } from "../business/product/models/ProductForInsert";
import { ProductForStockUpdate } from "../business/product/models/ProductForStockUpdate";
import { eq } from "drizzle-orm";
import httpStatus from "http-status";
import { ExpressError } from "./ExpressError";
import { restockProductCommandName } from "../business/product/command-names/restockProductCommandName";
import { sellProductCommandName } from "../business/product/command-names/sellProductCommandName";
import { createOrderCommandName } from "../business/order/command-names/createOrderCommandName";
import { OrderForInsert } from "../business/order/models/OrderForInsert";
import { getCommandBus } from "../shared/getCommandBus";
import { orderDbSchema } from "../business/order/orderDbSchema";
import { SuccessfulOrder } from "../business/order/models/SuccessfulOrder";
import { getProduct } from "../business/product/getProduct";

export const cqrs = createCqrs({
  queryHandlers: {
    [getProductsQueryName]: async () => await db.select().from(productDbSchema)
  },
  commandHandlers: {
    [addProductCommandName]: async ({ payload }: Command<ProductForInsert>) => {
      const insertResult = await db.insert(productDbSchema).values(payload)
        .returning({ id: productDbSchema.id });
      const insertedProductId = insertResult[0];
      return insertedProductId;
    },
    [restockProductCommandName]: async ({ payload }: Command<ProductForStockUpdate>) => {
      const selectedProduct = await getProduct(payload);
      selectedProduct.stock += payload.amount;
      const updateResult = await db.update(productDbSchema).set({
        stock: selectedProduct.stock
      }).where(eq(productDbSchema.id, selectedProduct.id)).returning({
        id: productDbSchema.id,
        stock: productDbSchema.stock
      });
      const productWithIncreasedStock = updateResult[0];
      return productWithIncreasedStock;
    },
    [sellProductCommandName]: async ({ payload }: Command<ProductForStockUpdate>) => {
      const selectedProduct = await getProduct(payload);
      const calculatedStock = selectedProduct.stock - payload.amount;
      if (calculatedStock < 0)
        throw <ExpressError>{
          status: httpStatus.UNPROCESSABLE_ENTITY,
          body: `Too small stock`
        }
      selectedProduct.stock = calculatedStock;
      const updateResult = await db.update(productDbSchema).set({
        stock: selectedProduct.stock
      }).where(eq(productDbSchema.id, selectedProduct.id)).returning({
        id: productDbSchema.id,
        stock: productDbSchema.stock
      });
      const productWithDecreasedStock = updateResult[0];
      return productWithDecreasedStock;
    },
    [createOrderCommandName]: async ({ payload }: Command<OrderForInsert>) => {
      const { stock } = await getCommandBus().execute({
        name: sellProductCommandName,
        payload: { id: payload.productId, amount: payload.amount }
      });
      const insertResult = await db.insert(orderDbSchema).values(payload).returning(
        { orderId: orderDbSchema.orderId, productId: orderDbSchema.productId });
      const { orderId, productId } = insertResult[0];
      return <SuccessfulOrder>{ orderId, productId, stock };
    }
  }
});