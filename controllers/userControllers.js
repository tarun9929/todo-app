import users from "../models/users.model.js";
import bcyript from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../utils/emailService.js";

export async function register(req, res) {
  const { username, email, password } = req.body;
  try {
    if (!(username && email && password))
      return res.status(400).json({ message: "all feilds must be required" });

    const hashPassword = await bcyript.hash(password, 10);

    const verifyToken = jwt.sign(
      { username: username, email: email, password: hashPassword },
      process.env.JWT_SECRET
    );

    sendMail(email, verifyToken)
      .then(async () => {
        console.log("Email has been sent to your eamil");

        res.status(201).json({
          message:
            "An email has been sent on your email address : Please verify user email ",
        });
      })
      .catch((err) => {
        console.log("can not send email");
        console.log(err.message);
      });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!(email && password))
      return res.status(400).json({ error: "all fields must required" });

    const user = await users.findOne({ email });

    if (!user) return res.status(401).json({ error: "unauthorize access" });

    if (!bcyript.compare(password, user.password))
      return res.status(401).json({ error: "unauthorize access" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function verifyEmail(req, res) {
  const token = req.params.token;

  try {
    if (!token) return res.status(401).json("invalied token");

    const user = jwt.verify(token, process.env.JWT_SECRET);

    console.log(user);

    await users.create({
      username: user.username,
      email: user.email,
      password: user.password,
    });

    res.status(201);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}
