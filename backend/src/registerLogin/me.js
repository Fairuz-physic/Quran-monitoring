import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const me = async (req, res) => {
  try {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
        message: "No token",
    });
}

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    res.json(user);

  } catch (err) {

    console.log(err);

    res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export { me };