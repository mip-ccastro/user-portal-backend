import Joi from "joi";

type data = {
    form_name: string;
    form_description: string;
}

type TResponse = {
    error: string | null;
    value: data | null;
}

const schema = Joi.object<data>({
    form_name: Joi.string()
        .required()
        .min(1)
        .max(255)
        .messages({
            'any.required': 'Form Name is required',
            'string.empty': 'Form Name is required',
            'string.min': 'Form Name must be at least 1 characters long',
            'string.max': 'Form Name must be at most 255 characters long',
        }),
    form_description: Joi.string()
        .optional()
        .allow('')
        .messages({
            'any.required': 'Form Description is required',
            'string.empty': 'Form Description is required'
        }),
}).messages({
    'object.unknown': 'You have used an invalid key ({#label})'
})

const createFormValidator = async (data: data): Promise<TResponse> => {
    try {
        data = await schema.validateAsync(data ?? {});
        return { error: null, value: data };
    } catch (error: any) {
        return { error: error.details[0].message, value: null };
    }
}

export default createFormValidator