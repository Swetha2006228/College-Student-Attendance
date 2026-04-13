import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";

export const refreshTokenController = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });

    // Verify refresh token
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    
    let user = await User.findById(decoded.id);
    let role = "superadmin";

    if (!user) {
      user = await Teacher.findById(decoded.id);
      role = "teacher";
    }

    if (!user || user.refreshToken !== token)
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });

    // Create new access token
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role,
        isSuper_admin: role === "superadmin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ success: true, accessToken });
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Token expired / invalid" });
  }
};
