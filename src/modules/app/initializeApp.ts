import { env } from "../../../env";
import { optimizeApp } from './optimizeApp';
import { initializeDb } from "./initializeDb";
import express from "express";
import { router } from "../shared/router";
import { handleError } from "./handleError";
import { addOrderRoutes } from "../business/order/addOrderRoutes";
import { addProductRoutes } from "../business/product/addProductRoutes";

export const initializeApp = async () => {
    const app = express();
    app.use(router);
    optimizeApp();
    router.use(express.json());
    await initializeDb();
    addProductRoutes();
    addOrderRoutes();
    router.use(handleError);
    app.listen(env.PORT, () => console.log(`APP STARTED`));
}