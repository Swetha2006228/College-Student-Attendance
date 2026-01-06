import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().trim().required().email().messages({
    "string.base": "email must be a string",
    "string.empty": "email is required",
    "any.required": "email is required",
    "string.email": "email is invalid",
  }),

  password: Joi.string().trim().required().min(8).messages({
    "string.empty": "password is required",
    "any.required": "password is required",
    "string.min": "password must be at least 8 characters",
  }),

  isSuper_admin: Joi.boolean().optional(),
});
