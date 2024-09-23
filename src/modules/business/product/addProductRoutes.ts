import { getQueryBus } from "../../shared/getQueryBus";
import { moduleRoute } from "./moduleRoute";
import { Request } from 'express';
import { getProductsQueryName } from "./query-names/getProductsQueryName";
import { ProductForInsert } from "./models/ProductForInsert";
import { getCommandBus } from "../../shared/getCommandBus";
import { addProductCommandName } from "./command-names/addProductCommandName";
import { productDbSchema } from "./productDbSchema";
import { productValidator } from "./validation/productValidator";
import { router } from "../../shared/router";
import { restockProductCommandName } from "./command-names/restockProductCommandName";
import { ProductForStockUpdate } from "./models/ProductForStockUpdate";
import { sellProductCommandName } from "./command-names/sellProductCommandName";
import { productForStockUpdateValidator } from "./validation/productForStockUpdateValidator";

export const addProductRoutes = () => {
    router.get(moduleRoute, async (_, rsp) => {
        const products = await getQueryBus().query(
            { name: getProductsQueryName, payload: null });
        rsp.send(products);
    });
    router.post(moduleRoute, async ({ body }: Request<never,
        Pick<typeof productDbSchema.$inferSelect, `id`>,
        ProductForInsert>, rsp) => {
        await productValidator.validate(body)
        const insertedProductId = await getCommandBus().execute(
            { name: addProductCommandName, payload: body });
        rsp.send(insertedProductId);
    });
    router.post(`${moduleRoute}/:id/restock`, async ({ body, params }:
        Request<{id: string}, Pick<typeof productDbSchema.$inferSelect, `id`>,
        Omit<ProductForStockUpdate, `id`>>, rsp) => {
        await productForStockUpdateValidator.validate({ ...body, id: +params.id });
        const productWithIncreasedStock = await getCommandBus().execute({
            name: restockProductCommandName,
            payload: { ...body, id: +params.id }
        });
        rsp.send(productWithIncreasedStock);
    });
    router.post(`${moduleRoute}/:id/sell`, async ({ body, params }:
        Request<{id: string}, Pick<typeof productDbSchema.$inferSelect, `id`>,
        Omit<ProductForStockUpdate, `id`>>, rsp) => {
        await productForStockUpdateValidator.validate({ ...body, id: +params.id });
        const productWithDecreasedStock = await getCommandBus().execute({
            name: sellProductCommandName,
            payload: { ...body, id: +params.id }
        });
        rsp.send(productWithDecreasedStock);
    });
}