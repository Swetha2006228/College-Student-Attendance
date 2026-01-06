import Joi from "joi";
export const loginSchema=Joi.object({
    email:Joi.string().required().email().trim().messages({
        "string.base":"email must be a string",
        "string.empty":"email is required",
        "any.required":"email is required",
        "string.email":"email is invalid",
    }),
    password:Joi.string().trim().required().min(8).messages({
        "string.base":"password must be a string",

        "string.empty":"password is required",
        "string.min":"password atleast 8 characters",

        "any.required":"password is required",
    })
});

