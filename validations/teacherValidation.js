import Joi from "joi";

export const validateTeacher = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.base": "name must be a string",
    "any.required": "name is required",
  }),
  email: Joi.string().required().email().trim().messages({
    "string.base": "email must be a string",
    "string.empty": "email is required",
    "any.required": "email is required",
    "string.email": "email is invalid",
  }),
  password: Joi.string().trim().required().min(8).messages({
    "string.base": "password must be a string",
    "string.empty": "password is required",
    "string.min": "password atleast 8 characters",
    "any.required": "password is required",
  }),
});
