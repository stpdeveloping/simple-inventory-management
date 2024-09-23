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
import { createOrderWithProductsCommandName } from "../business/order/command-names/createOrderWithProductsCommandName";
import { OrderWithProducts } from "../business/order/models/OrderWithProducts";
import { ProductWithUpdatedStock } from "../business/product/models/ProductWithUpdatedStock";
import { ProductWithPossiblyUpdatedStock } from "../business/product/models/ProductWithPossiblyUpdatedStock";
import { errorMap } from "./errorMap";
import { nestedCqrs } from "./nestedCqrs";
import { sellProductCommandName } from "../business/product/command-names/sellProductCommandName";
import { getProductQueryName } from "../business/product/query-names/getProductQueryName";
import { updateProductFromOrder } from "../business/product/command-names/updateProductFromOrder";
import { SuccessfulProductFromOrder } from "../business/product/models/SuccessfulProductFromOrder";
import { createSuccessfulOrderWithProducts } from "./createSuccessfulOrderWithProducts";

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
      const selectedProduct = await nestedCqrs.buses.queriesBus.query({
        name: getProductQueryName,
        payload: payload
      });
      selectedProduct.stock += payload.amount;
      const updateResult = await db.update(productDbSchema).set({
        stock: selectedProduct.stock
      }).where(eq(productDbSchema.id, selectedProduct.id)).returning({
        id: productDbSchema.id,
        stock: productDbSchema.stock
      });
      const productWithIncreasedStock: ProductWithUpdatedStock = updateResult[0];
      return productWithIncreasedStock;
    },
    [sellProductCommandName]: async ({ payload }: Command<ProductForStockUpdate>) => {
      const selectedProduct = await nestedCqrs.buses.queriesBus.query({
        name: getProductQueryName,
        payload: payload
      });
      const calculatedStock = selectedProduct.stock - payload.amount;
      if (calculatedStock < 0)
        throw <ExpressError<string>>{
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
      const productWithDecreasedStock: ProductWithUpdatedStock = updateResult[0];
      return productWithDecreasedStock;
    },
    [createOrderWithProductsCommandName]: async ({ payload }:
      Command<OrderWithProducts>) => {
      const productsWithPossiblyUpdatedStock: ProductWithPossiblyUpdatedStock[] = [];
      let successfulProductFromOrder: SuccessfulProductFromOrder = null;
      for(const product of payload.products) {
        try {
          successfulProductFromOrder = await nestedCqrs.buses.commandsBus.execute({
            name: updateProductFromOrder,
            payload: { ...product, productId: product.id, customerId: payload.customerId }
          });
          productsWithPossiblyUpdatedStock.push({
            id: successfulProductFromOrder!.productId,
            stock: successfulProductFromOrder!.stock
          });
        }
        catch (err) {
          const existingProduct = await nestedCqrs.buses.queriesBus.query({
            name: getProductQueryName,
            payload: { id: product.id }
          });;
          const { status, body } = err as ExpressError<string>;
          const errorMsg = status === httpStatus.UNPROCESSABLE_ENTITY ?
            body : errorMap[status]();
          productsWithPossiblyUpdatedStock.push({
            id: product.id,
            stock: existingProduct.stock, errorMsg: errorMsg
          });
        }
      };
      return createSuccessfulOrderWithProducts(successfulProductFromOrder,
        productsWithPossiblyUpdatedStock);
    }
  }
});