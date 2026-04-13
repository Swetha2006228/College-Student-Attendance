import User from "../models/userModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
dotenv.config();
export const registerController = async (req, res) => {
  try {
    const { email, password, isSuper_admin } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const user = new User({
      email,
      password,
      isSuper_admin,
    });

    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "user registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// export const loginController = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("try kullle vantaan");
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid Credentials" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid Credentials" });
//     }
//     const token = jwt.sign(
//       { id: user._id, email: user.email, isSuper_admin: user.isSuper_admin },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN }
//     );
//     return res
//       .status(200)
//       .json({
//         success: true,
//         isSuper_admin: user.isSuper_admin,
//         token,
//         message: "successfully login",
//       });
//   } catch (error) {
//     console.error("Login Error:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Interal server Error" });
//   }
// };


