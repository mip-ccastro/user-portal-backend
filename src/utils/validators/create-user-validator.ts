import Joi from "joi";
import { user_role, user_status } from "../../core/constants/enum";

type data = {
    username: string;
    password: string;
    user_role: string;
    email: string;
    first_name?: string;
    last_name?: string;
    user_status?: number;
    is_authorized?: boolean;
}

type TResponse = {
    error: string | null;
    value: data | null;
}

const schema = Joi.object<data>({
    password: Joi.string()
        .required()
        .min(8)
        .max(100)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)
        .messages({ 
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must be at most 100 characters long',
            'any.required': 'Password is required',
            'string.empty': 'Password is required'
        }),
    username: Joi.string()
        .min(8)
        .max(100)
        .required()
        .messages({ 
            'any.required': 'Username is required',
            'string.empty': 'Username is required',
            'string.min': 'Username must be at least 8 characters long',
            'string.max': 'Username must be at most 100 characters long',
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({ 
            'any.required': 'Email is required',
            'string.empty': 'Email is required',
            'string.email': 'Email is invalid',
        }),
    user_role: Joi.string()
        .required()
        .valid(...Object.values(user_role))
        .default(user_role.user)
        .messages({ 
            'any.required': 'User Role is required',
            'string.empty': 'User Role is required',
            'string.valid': 'User Role is invalid',
            'any.only': 'User Role is invalid',
        }),
    user_status: Joi.number()
        .optional()
        .valid(...Object.values(user_status))
        .default(user_status.Inactive)
        .messages({ 
            'number.base': 'User Status must be a number',
            'number.valid': 'User Status is invalid',
            'any.only': 'User Status is invalid',
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
    is_authorized: Joi.boolean()
        .optional()
        .default(false)
        .messages({ 
            'boolean.base': 'Is Authorized must be a boolean',
        }), 
}).messages({
    'object.unknown': 'You have used an invalid key ({#label})'
})

const createUserValidator = async (data: data): Promise<TResponse> => {
    try {
        data = await schema.validateAsync(data ?? {});
        return { error: null, value: data };
    } catch (error: any) {
        return { error: error.details[0].message, value: null };
    }
}

export default createUserValidator