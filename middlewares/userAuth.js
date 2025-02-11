import jwt from "jsonwebtoken";

export default async function userAuth(req, res, next) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized access" });

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err)
        return res
          .status(401)
          .json({ message: "Unauthorized access: can not verfiy the token" });
      req.user = data;
      return next();
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
