import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, isSuper_admin: user.isSuper_admin },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // access token expiry
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" } // refresh token expiry
  );
};
