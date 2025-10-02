import Joi from "joi";
import { user_role, user_status } from "../../core/constants/enum";

type data = {
    user_role: string;
    email: string;
    first_name: string;
    last_name: string;
    user_status: number;
    is_authorized: boolean;
}

type TResponse = {
    error: string | null;
    value: data | null;
}

const schema = Joi.object<data>({
    email: Joi.string()
        .email()
        .optional()
        .messages({ 
            'any.required': 'Email is required',
            'string.empty': 'Email is required',
            'string.email': 'Email is invalid',
        }),
    user_role: Joi.string()
        .optional()
        .valid(...Object.values(user_role))
        .messages({ 
            'any.required': 'User Role is required',
            'string.empty': 'User Role is required',
            'string.valid': 'User Role is invalid',
            'any.only': 'User Role is invalid',
        }),
    first_name: Joi.string()
        .optional()
        .max(100)
        .messages({ 
            'string.max': 'First Name must be at most 100 characters long',
            'string.base': 'First Name must be a string',
            'string.empty': 'First Name cannot be empty',
        }),
    last_name: Joi.string()
        .optional()
        .max(100)
        .messages({
            'string.max': 'Last Name must be at most 100 characters long',
            'string.base': 'Last Name must be a string',
            'string.empty': 'Last Name cannot be empty',
        }),
    user_status: Joi.number()
        .optional()
        .valid(...Object.values(user_status))
        .messages({ 
            'number.base': 'User Status must be a number',
            'number.valid': 'User Status is invalid',
            'any.only': 'User Status is invalid',
        }),
}).messages({
    'object.unknown': 'You have used an invalid key ({#label})'
})

const updateUserValidator = async (data: data): Promise<TResponse> => {
    try {
        data = await schema.validateAsync(data ?? {});
        if(data.user_status !== 1) {
            data.is_authorized = false
        } else {
            data.is_authorized = true
        }
        return { error: null, value: data };
    } catch (error: any) {
        return { error: error.details[0].message, value: null };
    }
}

export default updateUserValidator