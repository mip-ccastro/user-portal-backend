import Joi from "joi";
import isValidUUID from "../helper/validateUUID";

type data = {
    form_id: string;
    user_id: string;
    submission_data: string;
}

type TResponse = {
    error: string | null;
    value: data | null;
}

const schema = Joi.object<data>({
    form_id: Joi.string()
        .min(1)
        .required()
        .custom((value, helpers) => {
            if (isValidUUID(value)) {
                return value
            }
            return helpers.error('string.uuid');
        })
        .messages({
            'any.required': 'Form ID is required',
            'string.empty': 'Form ID is required',
            'string.min': 'Form ID must be at least 1 characters long',
            'string.uuid': 'Form ID is invalid',
        }),
    user_id: Joi.string()
        .required()
        .min(1)
        .custom((value, helpers) => {
            if (isValidUUID(value)) {
                return value
            }
            return helpers.error('string.uuid');
        })
        .messages({
            'any.required': 'User ID is required',
            'string.empty': 'User ID is required',
            'string.min': 'User ID must be at least 1 characters long',
            'string.uuid': 'User ID is invalid',
        }),
    submission_data: Joi.string()
        .required()
        .messages({
            'any.required': 'Submission Data is required',
            'string.empty': 'Submission Data is required'
        }),
}).messages({
    'object.unknown': 'You have used an invalid key ({#label})'
})

const createSubmissionValidator = async (data: data): Promise<TResponse> => {
    try {
        data = await schema.validateAsync(data ?? {});
        return { error: null, value: data };
    } catch (error: any) {
        return { error: error.details[0].message, value: null };
    }
}

export default createSubmissionValidator