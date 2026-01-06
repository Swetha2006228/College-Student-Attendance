import { loginSchema } from "../validations/loginValidation.js";
import { validateTeacher } from "../validations/teacherValidation.js";

export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};


export const validateTeacherRegister = (req, res, next) => {
  const { error } = validateTeacher.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};
