import Joi from "joi";

type data = {
    form_name: string;
    form_description: string;
    form_fields: string
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
    form_fields: Joi.string()
        .optional()
        .allow('')
        .messages({
            'any.required': 'Form Fields is required',
            'string.empty': 'Form Fields is required'
        }),
}).messages({
    'object.unknown': 'You have used an invalid key ({#label})'
})

const updateFormValidator = async (data: data): Promise<TResponse> => {
    try {
        data = await schema.validateAsync(data ?? {});
        return { error: null, value: data };
    } catch (error: any) {
        return { error: error.details[0].message, value: null };
    }
}

export default updateFormValidator