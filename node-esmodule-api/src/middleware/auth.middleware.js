import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const headers = req.headers.authorization;

    if (!headers) {
      return res.status(401).json({
        msg: "Access token required",
      });
    }

    const token = headers.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        msg: "Access token is missing",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decode;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.name, error.message);

    return res.status(401).json({
      msg: "Access token expired or invalid",
    });
  }
};
