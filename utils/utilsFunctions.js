import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30s",
  });
}
