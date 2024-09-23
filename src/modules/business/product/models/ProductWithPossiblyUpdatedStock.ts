import { ProductWithUpdatedStock } from "./ProductWithUpdatedStock";

export type ProductWithPossiblyUpdatedStock =
    ProductWithUpdatedStock & { errorMsg?: string };