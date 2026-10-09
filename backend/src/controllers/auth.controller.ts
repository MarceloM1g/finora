import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  COOKIE_NAME,
  cookieOptions,
  SESSION_DAYS,
  SESSION_MAX_AGE,
} from "../config/cookie.js";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailNormalized = email.trim().toLowerCase();

    if (!emailRegex.test(emailNormalized)) {
      return res.status(400).json({
        error: "E-mail inválido",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: emailNormalized,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "E-mail já cadastrado",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email: emailNormalized,
        passwordHash: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "Conta Criada com sucesso!",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao criar conta",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios",
      });
    }

    const emailNormalized = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: emailNormalized,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Usuário ou senha incorretos",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Usuário ou senha incorretos",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: `${SESSION_DAYS}d`,
      },
    );

    res.cookie(COOKIE_NAME, token, {
      ...cookieOptions,
      maxAge: SESSION_MAX_AGE,
    });

    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao fazer login",
    });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Usuário não encontrado",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, cookieOptions);

  return res.status(200).json({
    message: "Logout realizado com sucesso",
  });
}
