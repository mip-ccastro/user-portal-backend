import Joi from "joi";
import { template_type } from "../../core/constants/enum";

type data = {
    type: string;
    template_name: string;
    content?: string
    recipients: string[]
}

type TResponse = {
    error: string | null;
    value: data | null;
}

const schema = Joi.object<data>({
    type: Joi.string()
        .required()
        .valid(...Object.values(template_type))
        .default(template_type.email)
        .messages({ 
            'any.required': 'Template Type is required',
            'string.empty': 'Template Type is required',
            'string.valid': 'Template Type is invalid',
            'any.only': 'Template Type is invalid',
        }),
    template_name: Joi.string()
        .required()
        .min(1)
        .max(255)
        .messages({ 
            'any.required': 'Template Name is required',
            'string.empty': 'Template Name is required',
            'string.min': 'Template Name must be at least 8 characters long',
            'string.max': 'Template Name must be at most 100 characters long',
        }),
    content: Joi.string()
        .allow('')
        .default('')
        .optional(),
    recipients: Joi.array()
        .items(Joi.string())
        .default([])
        .optional()
}).messages({
    'object.unknown': 'You have used an invalid key ({#label})'
})

const updateTemplateValidator = async (data: data): Promise<TResponse> => {
    try {
        data = await schema.validateAsync(data ?? {});
        return { error: null, value: data };
    } catch (error: any) {
        return { error: error.details[0].message, value: null };
    }
}

export default updateTemplateValidator