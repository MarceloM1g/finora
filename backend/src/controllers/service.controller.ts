import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function createService(req: Request, res: Response) {
  try {
    const { name, price } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "O Campo nome é obrigatório" });
    }

    if (!Number.isFinite(price)) {
      return res.status(400).json({ error: "Preço inválido" });
    }

    if (price < 0) {
      return res.status(400).json({ error: "O preço não pode ser negativo" });
    }

    await prisma.service.create({
      data: {
        userId: req.user.id,
        name,
        price,
      },
    });

    return res.status(201).json({
      message: "Serviço deletado com sucesso",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao criar Serviço",
    });
  }
}

export async function getService(req: Request, res: Response) {
  try {
    const services = await prisma.service.findMany({
      where: {
        userId: req.user.id,
      },
    });

    return res.status(200).json({
      services,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao carregar Serviço",
    });
  }
}

export async function deleteService(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !id.trim()) {
      return res.status(400).json({
        error: "ID inválido ou não informado",
      });
    }

    const result = await prisma.service.deleteMany({
      where: {
        userId: req.user.id,
        id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        error: "Serviço não encontrado",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao deletar serviço",
    });
  }
}

export async function editService(req: Request, res: Response) {
  try {
    const { name, price } = req.body;
    const { id } = req.params;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        error: "O campo nome é obrigatório",
      });
    }

    if (
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        error: "O preço deve ser um número válido e não negativo",
      });
    }

    if (typeof id !== "string" || !id.trim()) {
      return res.status(400).json({
        error: "ID inválido ou não informado",
      });
    }

    const result = await prisma.service.updateMany({
      where: {
        id,
        userId: req.user.id,
      },
      data: {
        name: name.trim(),
        price: Number(price),
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        error: "Serviço não encontrado",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao editar serviço",
    });
  }
}
