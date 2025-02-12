import users from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../utils/emailService.js";
import { generateAccessToken } from "../utils/utilsFunctions.js";

export async function register(req, res) {
  const { username, email, password } = req.body;
  try {
    if (!(username && email && password))
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await users.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashPassword = await bcrypt.hash(password, 10);

    const verifyToken = jwt.sign(
      { username, email, password: hashPassword },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Token expires in 15 minutes
    );

    await sendMail(email, verifyToken);
    console.log("Email has been sent to:", email);

    res.status(201).json({
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!(email && password))
      return res.status(400).json({ message: "All fields are required" });

    const user = await users.findOne({ email }).select("+password");

    if (!user)
      return res.status(401).json({ message: "Unauthorized: User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(401)
        .json({ message: "Unauthorized: Incorrect password" });

    const token = generateAccessToken(user);
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET
    );

    await users.findByIdAndUpdate(
      user.id,
      { $push: { refreshTokens: refreshToken } },
      { new: true }
    );

    res.status(200).json({
      message: "Login successful",
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function verifyEmail(req, res) {
  const { token } = req.params;
  try {
    if (!token) return res.status(400).json({ message: "Invalid token" });

    const userData = jwt.verify(token, process.env.JWT_SECRET);

    const existingUser = await users.findOne({ email: userData.email });
    if (existingUser)
      return res.status(400).json({ message: "Email already verified" });

    const newUser = await users.create({
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });

    res.status(201).json({
      message: "Email verified successfully! You can now log in.",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (err) {
    console.error("Verification Error:", err.message);
    res.status(400).json({ error: "Invalid or expired token" });
  }
}

export async function refreshToken(req, res) {
  const refToken = req.body.refToken;
  if (!refToken) return res.status(401).json({ message: "no valid token" });
  const token = await users.findOne({ refreshTokens: refToken });
  if (!token) return res.status(403).json({ message: "invalid refresh token" });

  jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "invalid refresh token" });
    const newToken = generateAccessToken({ user: user.id });
    res.status(200).json({ accessToken: newToken });
  });
}
