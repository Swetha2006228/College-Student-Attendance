import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "../validations/loginValidation.js";

export const loginController = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { email, password } = req.body;

    let user = await User.findOne({ email });
    let role = null;

    if (user && user.isSuper_admin) {
      role = "superadmin";
    } else {
      user = await Teacher.findOne({ email });
      role = "teacher";
    }

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role,
        isSuper_admin: role === "superadmin",
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    
    return res.json({
      success: true,
      message: "Successfully logged in",
      token,
      role,
      isSuper_admin: role === "superadmin",
      teacherid: role === "teacher" ? user._id : null,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

