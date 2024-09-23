import compression from "compression";
import { router } from "../shared/router";

export const optimizeApp = () => router.use(compression());