import Joi from "joi";

type data = {
    name: string;
    email: string;
    phone: string;
}

type TResponse = {
    error: string | null;
    value: data | null;
}

const schema = Joi.object<data>({
    name: Joi.string()
        .required()
        .min(1)
        .max(255)
        .messages({
            'any.required': 'Name is required',
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 8 characters long',
            'string.max': 'Name must be at most 100 characters long',
        }),
    email: Joi.string()
        .optional()
        .allow('')
        .email()
        .messages({
            'any.required': 'Email is required',
            'string.empty': 'Email is required',
            'string.email': 'Email is invalid',
        }),
    phone: Joi.string()
        .optional()
        .allow('')
        .default('')
        .messages({
            'any.required': 'Phone is required',
            'string.empty': 'Phone is required',
        })
}).messages({
    'object.unknown': 'You have used an invalid key ({#label})'
})

const createRecipientValidator = async (data: data): Promise<TResponse> => {
    try {
        data = await schema.validateAsync(data ?? {});
        return { error: null, value: data };
    } catch (error: any) {
        return { error: error.details[0].message, value: null };
    }
}

export default createRecipientValidator