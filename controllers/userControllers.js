import users from "../models/users.model.js";
import bcyript from "bcryptjs";

export async function register(req, res) {
  const { username, email, password } = req.body;
  try {
    if (!(username && email && password))
      return res.status(400).json({ message: "all feilds must be required" });

    const hashPassword = await bcyript.hash(password, 10);

    const user = await users.create({
      username,
      email,
      password: hashPassword,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}
