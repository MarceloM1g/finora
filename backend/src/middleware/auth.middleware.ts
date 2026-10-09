import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Não autenticado",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded !== "object" || decoded === null) {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    if (typeof decoded.userId !== "string") {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Token inválido",
    });
  }
}
