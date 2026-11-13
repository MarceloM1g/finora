import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function createClient(req: Request, res: Response) {
  try {
    const { name, email } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        error: "O nome é obrigatório",
      });
    }

    if (email !== undefined && email !== null && typeof email !== "string") {
      return res.status(400).json({
        error: "O e-mail deve ser um texto",
      });
    }

    const client = await prisma.client.create({
      data: {
        userId: req.user.id,
        name: name.trim(),
        email: email?.trim() || null,
      },
    });

    return res.status(201).json({
      message: "Cliente criado com sucesso",
      client,
    });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);

    return res.status(500).json({
      error: "Erro ao criar Cliente",
    });
  }
}

export async function getClient(req: Request, res: Response) {
  try {
    const clients = await prisma.client.findMany({
      where: {
        userId: req.user.id,
      },
    });

    return res.status(200).json({
      clients,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao carregar Clientes",
    });
  }
}

export async function deleteClient(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !id.trim()) {
      return res.status(400).json({
        error: "ID inválido ou não informado",
      });
    }

    const result = await prisma.client.deleteMany({
      where: {
        userId: req.user.id,
        id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        error: "Cliente não encontrado",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao deletar Cliente",
    });
  }
}

export async function editClient(req: Request, res: Response) {
  try {
    const { name, email } = req.body;
    const { id } = req.params;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        error: "O campo nome é obrigatório",
      });
    }

    if (typeof id !== "string" || !id.trim()) {
      return res.status(400).json({
        error: "ID inválido ou não informado",
      });
    }

    const result = await prisma.client.updateMany({
      where: {
        id,
        userId: req.user.id,
      },
      data: {
        name: name.trim(),
        email: typeof email === "string" ? email.trim() || null : null,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        error: "Cliente não encontrado",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao editar Cliente",
    });
  }
}
