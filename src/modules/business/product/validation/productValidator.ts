import vine from "@vinejs/vine";
import { getProductValidationSchema } from "./getProductValidationSchema";

export const productValidator = vine.compile(getProductValidationSchema());