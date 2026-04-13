import Joi from "joi";
export const classValidation = Joi.object({
  classname: Joi.string().required().trim().messages({
    "string.base": "classname must be a string",
    "string.empty": "classname is required",
    "any.required": "classnamme is  required",
  }),
  section: Joi.string().required().trim().messages({
    "string.base": "section must be string",
    "string.empty": "section is required",
    "any.required": "section is required",
  }),
  year: Joi.number().required().messages({
    "number.base": "year must be number",
    "any.required": "year is required",
  }),
  teacherid: Joi.string().trim().required().messages({
    "any.required": "teacherid is required",
    "string.base": "teacherid must be a string",
  }),
});
