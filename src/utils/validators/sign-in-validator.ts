import Joi from "joi";

type data = {
    username: string;
    password: string;
}

type TResponse = {
    error: string | null;
    value: data | null;
}

const schema = Joi.object<data>({
    username: Joi.string()
        .required()
        .min(8)
        .max(100)
        .messages({ 
            'any.required': 'Username is required',
            'string.empty': 'Username is required',
            'string.min': 'Username must be at least 8 characters long',
            'string.max': 'Username must be at most 100 characters long',
        }),
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
        })
}).messages({
    'object.unknown': 'You have used an invalid key ({#label})'
})

const signInValidator = async (data: data): Promise<TResponse> => {
    try {
        data = await schema.validateAsync(data ?? {});
        return { error: null, value: data };
    } catch (error: any) {
        return { error: error.details[0].message, value: null };
    }
}

export default signInValidator