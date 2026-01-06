import Joi from "joi";

export const validateStudent = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.base": "name must be a string",
    "string.empty": "name is required",
  }),
  classid: Joi.string().trim().required().messages({
    "string.base": "classid must be a string",
    "string.empty": "classid is required",
    "any.required": "classid is required",
  }),
});
