import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("token----");
  console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "access denied .no token provided" });
  }
  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};
export const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.isSuper_admin !== true) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only Super Admin can perform this action.",
    });
  }
  next();
};
