import Joi from "joi";
export const attendanceValidation = Joi.object({
  classid: Joi.string().required().messages({
    "any.required": "classid is required",
  }),
  date: Joi.string().required().messages({
    "any.required": "date is required",
  }),
  records: Joi.array()
    .items(
      Joi.object({
        studentid: Joi.string().required(),
        status: Joi.string().valid("Present", "Absent").required(),
      })
    )
    .required()
    .messages({
      "any.required": "records are required",
    }),
});
