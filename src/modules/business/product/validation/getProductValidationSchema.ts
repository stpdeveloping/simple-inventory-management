import vine from "@vinejs/vine";

export const getProductValidationSchema = () => vine.object({
    name: vine.string().minLength(1).maxLength(50),
    description: vine.string().minLength(1).maxLength(50),
    price: vine.number({ strict: true }).positive().min(1)
        .decimal([0, 2]),
    stock: vine.number({ strict: true }).positive()
        .withoutDecimals()
});